import { Client } from '@notionhq/client';

// Notion 클라이언트 초기화
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

/**
 * Notion에서 페이지를 검색합니다
 * @param query 검색할 키워드
 * @param filter 검색 필터 (옵션)
 * @returns 검색 결과
 */
export async function searchPages(query: string, filter?: { property?: string; value?: string }) {
  try {
    const response = await notion.search({
      query,
      filter: filter ? { property: 'object', value: 'page' } : undefined,
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
    });

    return {
      success: true,
      results: response.results,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };
  } catch (error) {
    console.error('Notion 페이지 검색 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      results: [],
    };
  }
}

/**
 * 특정 페이지의 내용을 가져옵니다
 * @param pageId 페이지 ID
 * @returns 페이지 정보 및 블록 내용
 */
export async function getPageContent(pageId: string) {
  try {
    // 페이지 메타데이터 가져오기
    const page = await notion.pages.retrieve({ page_id: pageId });

    // 페이지 블록 내용 가져오기
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    return {
      success: true,
      page,
      blocks: blocks.results,
    };
  } catch (error) {
    console.error('Notion 페이지 내용 가져오기 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}

/**
 * 데이터베이스를 쿼리합니다
 * @param databaseId 데이터베이스 ID
 * @param filter 필터 조건 (옵션)
 * @param sorts 정렬 조건 (옵션)
 * @returns 데이터베이스 쿼리 결과
 */
export async function queryDatabase(
  databaseId: string,
  filter?: any,
  sorts?: any[]
) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter,
      sorts,
    });

    return {
      success: true,
      results: response.results,
      hasMore: response.has_more,
      nextCursor: response.next_cursor,
    };
  } catch (error) {
    console.error('Notion 데이터베이스 쿼리 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
      results: [],
    };
  }
}

/**
 * 데이터베이스 정보를 가져옵니다
 * @param databaseId 데이터베이스 ID
 * @returns 데이터베이스 정보
 */
export async function getDatabase(databaseId: string) {
  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });

    return {
      success: true,
      database,
    };
  } catch (error) {
    console.error('Notion 데이터베이스 정보 가져오기 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류',
    };
  }
}

/**
 * 페이지 제목을 추출합니다
 * @param page Notion 페이지 객체
 * @returns 페이지 제목
 */
export function getPageTitle(page: any): string {
  try {
    if (page.properties?.title?.title?.[0]?.plain_text) {
      return page.properties.title.title[0].plain_text;
    }
    if (page.properties?.Name?.title?.[0]?.plain_text) {
      return page.properties.Name.title[0].plain_text;
    }
    return 'Untitled';
  } catch {
    return 'Untitled';
  }
}

/**
 * 블록의 텍스트 내용을 추출합니다
 * @param block Notion 블록 객체
 * @returns 블록 텍스트
 */
export function getBlockText(block: any): string {
  try {
    const blockType = block.type;
    const blockContent = block[blockType];

    if (blockContent?.rich_text) {
      return blockContent.rich_text
        .map((text: any) => text.plain_text)
        .join('');
    }

    return '';
  } catch {
    return '';
  }
}
