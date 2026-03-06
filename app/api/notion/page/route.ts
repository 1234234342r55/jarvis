import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, getPageTitle, getBlockText } from '@/lib/notion';

/**
 * Notion 페이지 내용 가져오기 API
 * GET /api/notion/page?id=페이지ID
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 페이지 ID 가져오기
    const searchParams = request.nextUrl.searchParams;
    const pageId = searchParams.get('id');

    if (!pageId) {
      return NextResponse.json(
        { error: '페이지 ID를 입력해주세요. (id 파라미터 필요)' },
        { status: 400 }
      );
    }

    // Notion API 호출
    const result = await getPageContent(pageId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // 페이지 제목 추출
    const title = getPageTitle(result.page);

    // 블록 텍스트 추출
    const blocks = result.blocks?.map((block: any) => ({
      id: block.id,
      type: block.type,
      text: getBlockText(block),
      hasChildren: block.has_children,
    })) || [];

    // 결과 반환
    return NextResponse.json({
      success: true,
      page: {
        id: pageId,
        title,
        url: (result.page as any).url,
        created_time: (result.page as any).created_time,
        last_edited_time: (result.page as any).last_edited_time,
      },
      blocks,
      blockCount: blocks.length,
    });
  } catch (error) {
    console.error('Notion 페이지 가져오기 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
