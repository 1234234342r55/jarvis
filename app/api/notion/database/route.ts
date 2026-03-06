import { NextRequest, NextResponse } from 'next/server';
import { queryDatabase, getDatabase } from '@/lib/notion';

/**
 * Notion 데이터베이스 쿼리 API
 * GET /api/notion/database?id=데이터베이스ID&info=true (데이터베이스 정보만)
 * GET /api/notion/database?id=데이터베이스ID (데이터베이스 쿼리)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const databaseId = searchParams.get('id');
    const infoOnly = searchParams.get('info') === 'true';

    if (!databaseId) {
      return NextResponse.json(
        { error: '데이터베이스 ID를 입력해주세요. (id 파라미터 필요)' },
        { status: 400 }
      );
    }

    // 데이터베이스 정보만 요청한 경우
    if (infoOnly) {
      const result = await getDatabase(databaseId);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        database: result.database,
      });
    }

    // 데이터베이스 쿼리
    const result = await queryDatabase(databaseId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      results: result.results,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
      count: result.results.length,
    });
  } catch (error) {
    console.error('Notion 데이터베이스 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * Notion 데이터베이스 쿼리 API (POST 요청)
 * POST /api/notion/database
 * Body: { databaseId: string, filter?: object, sorts?: array }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { databaseId, filter, sorts } = body;

    if (!databaseId) {
      return NextResponse.json(
        { error: '데이터베이스 ID를 입력해주세요.' },
        { status: 400 }
      );
    }

    // Notion API 호출
    const result = await queryDatabase(databaseId, filter, sorts);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      filter,
      sorts,
      results: result.results,
      hasMore: result.hasMore,
      nextCursor: result.nextCursor,
      count: result.results.length,
    });
  } catch (error) {
    console.error('Notion 데이터베이스 API 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
