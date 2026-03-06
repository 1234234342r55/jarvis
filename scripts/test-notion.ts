/**
 * Notion API 테스트 스크립트
 *
 * 사용법:
 * npx tsx scripts/test-notion.ts [명령어] [인자]
 *
 * 명령어:
 * - search <검색어>: 페이지 검색
 * - page <페이지ID>: 페이지 내용 가져오기
 * - database <데이터베이스ID>: 데이터베이스 쿼리
 */

import dotenv from 'dotenv';
import { searchPages, getPageContent, queryDatabase, getDatabase, getPageTitle, getBlockText } from '../lib/notion';

// .env.local 파일 로드
dotenv.config({ path: '.env.local' });

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const param = args[1];

  if (!command) {
    console.log(`
사용법:
  npx tsx scripts/test-notion.ts search <검색어>
  npx tsx scripts/test-notion.ts page <페이지ID>
  npx tsx scripts/test-notion.ts database <데이터베이스ID>
  npx tsx scripts/test-notion.ts db-info <데이터베이스ID>

예시:
  npx tsx scripts/test-notion.ts search "회의록"
  npx tsx scripts/test-notion.ts page 1234567890abcdef
  npx tsx scripts/test-notion.ts database 1234567890abcdef
    `);
    return;
  }

  switch (command) {
    case 'search': {
      if (!param) {
        console.error('❌ 검색어를 입력해주세요.');
        return;
      }

      console.log(`🔍 Notion에서 "${param}" 검색 중...\n`);
      const result = await searchPages(param);

      if (!result.success) {
        console.error('❌ 검색 실패:', result.error);
        return;
      }

      console.log(`✅ 검색 결과: ${result.results.length}개 페이지 발견\n`);

      result.results.forEach((page: any, index: number) => {
        const title = getPageTitle(page);
        console.log(`${index + 1}. ${title}`);
        console.log(`   ID: ${page.id}`);
        console.log(`   URL: ${page.url}`);
        console.log(`   마지막 수정: ${page.last_edited_time}\n`);
      });

      if (result.hasMore) {
        console.log('📄 더 많은 결과가 있습니다.');
      }
      break;
    }

    case 'page': {
      if (!param) {
        console.error('❌ 페이지 ID를 입력해주세요.');
        return;
      }

      console.log(`📄 페이지 내용 가져오는 중...\n`);
      const result = await getPageContent(param);

      if (!result.success) {
        console.error('❌ 페이지 가져오기 실패:', result.error);
        return;
      }

      const title = getPageTitle(result.page);
      console.log(`✅ 페이지 제목: ${title}\n`);
      console.log(`블록 개수: ${result.blocks?.length || 0}\n`);

      if (result.blocks && result.blocks.length > 0) {
        console.log('📝 페이지 내용:\n');
        result.blocks.forEach((block: any, index: number) => {
          const text = getBlockText(block);
          if (text) {
            console.log(`${index + 1}. [${block.type}] ${text}`);
          }
        });
      }
      break;
    }

    case 'database': {
      if (!param) {
        console.error('❌ 데이터베이스 ID를 입력해주세요.');
        return;
      }

      console.log(`🗄️ 데이터베이스 쿼리 중...\n`);
      const result = await queryDatabase(param);

      if (!result.success) {
        console.error('❌ 데이터베이스 쿼리 실패:', result.error);
        return;
      }

      console.log(`✅ 쿼리 결과: ${result.results.length}개 항목\n`);

      result.results.forEach((item: any, index: number) => {
        const title = getPageTitle(item);
        console.log(`${index + 1}. ${title}`);
        console.log(`   ID: ${item.id}`);
        console.log(`   생성일: ${item.created_time}`);
        console.log(`   마지막 수정: ${item.last_edited_time}\n`);
      });

      if (result.hasMore) {
        console.log('📄 더 많은 결과가 있습니다.');
      }
      break;
    }

    case 'db-info': {
      if (!param) {
        console.error('❌ 데이터베이스 ID를 입력해주세요.');
        return;
      }

      console.log(`🗄️ 데이터베이스 정보 가져오는 중...\n`);
      const result = await getDatabase(param);

      if (!result.success) {
        console.error('❌ 데이터베이스 정보 가져오기 실패:', result.error);
        return;
      }

      const db = result.database as any;
      console.log(`✅ 데이터베이스 정보:\n`);
      console.log(`제목: ${getPageTitle(db)}`);
      console.log(`ID: ${db.id}`);
      console.log(`생성일: ${db.created_time}`);
      console.log(`마지막 수정: ${db.last_edited_time}\n`);

      if (db.properties) {
        console.log('📋 속성 목록:');
        Object.entries(db.properties).forEach(([key, value]: [string, any]) => {
          console.log(`  - ${key}: ${value.type}`);
        });
      }
      break;
    }

    default:
      console.error(`❌ 알 수 없는 명령어: ${command}`);
      console.log('사용 가능한 명령어: search, page, database, db-info');
  }
}

main().catch(console.error);
