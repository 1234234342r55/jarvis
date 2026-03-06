# Notion API 통합 가이드

이 프로젝트에 Notion API가 통합되었습니다. 아래 단계를 따라 설정을 완료하세요.

## 1. Notion Integration Token 발급받기

1. [Notion Integrations](https://www.notion.so/my-integrations) 페이지로 이동
2. "New integration" 버튼 클릭
3. Integration 이름 입력 (예: "Unorma Website")
4. Associated workspace 선택
5. "Submit" 클릭하여 생성
6. "Internal Integration Token"을 복사 (이 토큰은 한 번만 보여집니다!)

## 2. Integration에 페이지 권한 부여하기

Notion Integration이 페이지나 데이터베이스에 접근하려면 명시적으로 권한을 부여해야 합니다:

1. 접근하고 싶은 Notion 페이지나 데이터베이스로 이동
2. 오른쪽 상단의 "..." (더보기) 메뉴 클릭
3. "Add connections" 선택
4. 생성한 Integration 이름 선택
5. "Confirm" 클릭

⚠️ **중요**: Integration을 페이지에 연결하지 않으면 API 호출 시 권한 오류가 발생합니다!

## 3. .env.local 파일 설정

`.env.local` 파일을 열고 발급받은 토큰을 입력하세요:

```bash
NOTION_API_KEY=your_actual_integration_token_here
```

`your_notion_integration_token_here`를 실제 토큰으로 교체하세요.

## 4. 개발 서버 재시작

환경 변수를 변경했으므로 개발 서버를 재시작해야 합니다:

```bash
npm run dev
```

## 사용 방법

### A. API 엔드포인트 사용

개발 서버가 실행 중일 때 다음 API를 사용할 수 있습니다:

#### 1. 페이지 검색
```bash
# GET 요청
curl "http://localhost:3000/api/notion/search?q=검색어"

# POST 요청
curl -X POST http://localhost:3000/api/notion/search \
  -H "Content-Type: application/json" \
  -d '{"query": "회의록"}'
```

#### 2. 페이지 내용 가져오기
```bash
curl "http://localhost:3000/api/notion/page?id=페이지ID"
```

#### 3. 데이터베이스 쿼리
```bash
# 데이터베이스 내용 쿼리
curl "http://localhost:3000/api/notion/database?id=데이터베이스ID"

# 데이터베이스 정보만 가져오기
curl "http://localhost:3000/api/notion/database?id=데이터베이스ID&info=true"

# POST 요청 (필터와 정렬 포함)
curl -X POST http://localhost:3000/api/notion/database \
  -H "Content-Type: application/json" \
  -d '{
    "databaseId": "데이터베이스ID",
    "filter": {
      "property": "Status",
      "status": { "equals": "Done" }
    }
  }'
```

### B. 터미널 테스트 스크립트 사용

프로젝트에 포함된 테스트 스크립트를 사용할 수 있습니다:

```bash
# 페이지 검색
npx tsx scripts/test-notion.ts search "검색어"

# 페이지 내용 가져오기
npx tsx scripts/test-notion.ts page "페이지ID"

# 데이터베이스 쿼리
npx tsx scripts/test-notion.ts database "데이터베이스ID"

# 데이터베이스 정보
npx tsx scripts/test-notion.ts db-info "데이터베이스ID"
```

### C. 코드에서 직접 사용

React 컴포넌트나 서버 사이드 코드에서 직접 사용:

```typescript
import { searchPages, getPageContent, queryDatabase } from '@/lib/notion';

// 페이지 검색
const result = await searchPages("회의록");
console.log(result.results);

// 페이지 내용 가져오기
const page = await getPageContent("페이지ID");
console.log(page.blocks);

// 데이터베이스 쿼리
const dbResult = await queryDatabase("데이터베이스ID");
console.log(dbResult.results);
```

## Notion 페이지/데이터베이스 ID 찾기

### 페이지 ID 찾기:
1. Notion에서 페이지 열기
2. 브라우저 URL 확인
3. URL 형식: `https://www.notion.so/페이지제목-{페이지ID}?...`
4. 페이지ID는 하이픈이 없는 32자 문자열입니다

예시:
```
URL: https://www.notion.so/My-Page-1234567890abcdef1234567890abcdef
페이지 ID: 1234567890abcdef1234567890abcdef
```

또는 하이픈 포함 형식도 사용 가능:
```
페이지 ID: 12345678-90ab-cdef-1234-567890abcdef
```

### 데이터베이스 ID 찾기:
데이터베이스 페이지를 열면 페이지 ID와 동일한 방법으로 찾을 수 있습니다.

## 주요 유틸리티 함수

프로젝트의 `lib/notion.ts` 파일에 다음 함수들이 있습니다:

- `searchPages(query, filter?)` - 페이지 검색
- `getPageContent(pageId)` - 페이지 내용 가져오기
- `queryDatabase(databaseId, filter?, sorts?)` - 데이터베이스 쿼리
- `getDatabase(databaseId)` - 데이터베이스 정보 가져오기
- `getPageTitle(page)` - 페이지 제목 추출
- `getBlockText(block)` - 블록 텍스트 추출

## 문제 해결

### "Unauthorized" 오류
- `.env.local` 파일에 올바른 Integration Token이 설정되어 있는지 확인
- 개발 서버를 재시작했는지 확인

### "object not found" 오류
- Integration에 해당 페이지/데이터베이스 접근 권한이 부여되어 있는지 확인
- 페이지 ID가 정확한지 확인

### "validation error" 오류
- 페이지 ID 형식이 올바른지 확인 (32자 문자열 또는 하이픈 포함 UUID 형식)
- API 요청 파라미터가 올바른지 확인

## 더 알아보기

- [Notion API 공식 문서](https://developers.notion.com/)
- [Notion API Reference](https://developers.notion.com/reference)
- [@notionhq/client npm 패키지](https://www.npmjs.com/package/@notionhq/client)

## 예제 사용 사례

### 1. 최근 수정된 페이지 목록 표시
```typescript
const result = await searchPages("");
const pages = result.results.map(page => ({
  title: getPageTitle(page),
  url: page.url,
  lastEdited: page.last_edited_time
}));
```

### 2. 특정 데이터베이스에서 완료된 작업만 가져오기
```typescript
const result = await queryDatabase(
  "데이터베이스ID",
  {
    property: "Status",
    status: { equals: "Done" }
  }
);
```

### 3. 페이지 내용을 마크다운처럼 출력
```typescript
const { page, blocks } = await getPageContent("페이지ID");
console.log(`# ${getPageTitle(page)}\n`);
blocks.forEach(block => {
  const text = getBlockText(block);
  if (text) console.log(text);
});
```
