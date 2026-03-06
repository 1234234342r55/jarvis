import { NextRequest, NextResponse } from 'next/server';
import { searchPages } from '@/lib/notion';

/**
 * Notion 페이지 검색 API
 * GET /api/notion/search?q=검색어
 */
export async function GET(request: NextRequest) {
  try {
    // 쿼리 파라미터에서 검색어 가져오기
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요. (q 파라미터 필요)' },
        { status: 400 }
      );
    }

    // Notion API 호출
    const result = await searchPages(query);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // 결과 반환
    return NextResponse.json({
      success: true,
      query,
      results: result.results,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
      count: result.results.length,
    });
  } catch (error) {
    console.error('Notion 검색 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * Notion 페이지 검색 API (POST 요청)
 * POST /api/notion/search
 * Body: { query: string, filter?: object }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filter } = body;

    if (!query) {
      return NextResponse.json(
        { error: '검색어를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Notion API 호출
    const result = await searchPages(query, filter);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // 결과 반환
    return NextResponse.json({
      success: true,
      query,
      filter,
      results: result.results,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
      count: result.results.length,
    });
  } catch (error) {
    console.error('Notion 검색 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
