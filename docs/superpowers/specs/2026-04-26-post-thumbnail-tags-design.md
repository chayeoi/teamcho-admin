# 포스트 썸네일 & 태그 기능 설계

## 개요

포스트 업로드 시 썸네일 이미지와 태그를 설정할 수 있는 기능 추가.
썸네일은 관리자 포스트 목록과 외부 블로그 목록에 표시되고, 태그는 블로그 포스트 하단에 `#태그명` 형태로 표시된다.

---

## 데이터 레이어

### DB 변경 (Supabase)

```sql
ALTER TABLE posts ADD COLUMN thumbnail_url text;
ALTER TABLE posts ADD COLUMN tags text[] DEFAULT '{}';
```

### Post 타입

```typescript
export type Post = {
  id: string
  title: string
  content: string
  status: PostStatus
  is_visible: boolean
  published_at: string | null
  scheduled_at: string | null
  created_at: string
  updated_at: string
  author_id: string | null
  thumbnail_url: string | null   // 추가
  tags: string[]                 // 추가
}
```

### Server Actions 변경

- `createPost(title, content, thumbnailUrl?, tags?)` — 선택적 파라미터 추가
- `updatePost(id, { title?, content?, thumbnail_url?, tags? })` — 업데이트 페이로드에 포함

### 썸네일 유틸 (`lib/utils/thumbnail.ts`)

```typescript
// content HTML에서 첫 번째 img src 추출
export function getFirstImageFromContent(content: string): string | null

// 최종 표시 URL 결정 (thumbnail_url → 첫 content 이미지 → 정적 폴백)
export function resolveThumbnail(post: Pick<Post, 'thumbnail_url' | 'content'>): string
```

폴백 이미지: `/images/fallback-thumbnail.jpg`

---

## UI 컴포넌트

### ThumbnailPicker (`components/posts/ThumbnailPicker.tsx`)

- 현재 썸네일 미리보기 (없으면 플레이스홀더)
- [직접 업로드] 버튼 → 기존 `/api/upload` 재사용
- [본문 이미지에서 선택] → content HTML 파싱 후 이미지 목록 드롭다운/모달
- [제거] 버튼 → `thumbnail_url`을 null로 초기화

### TagInput (`components/posts/TagInput.tsx`)

- 인라인 태그 입력 필드
- 엔터 또는 쉼표 입력 시 태그 추가
- 각 태그에 `×` 버튼으로 제거
- UI에는 `#` 프리픽스 표시, DB에는 텍스트만 저장

### PostEditor 변경

- `ThumbnailPicker`, `TagInput` 통합
- `thumbnailUrl`, `tags` 상태 관리
- 저장/발행 시 함께 전송

---

## 표시

### 관리자 포스트 목록 (`/posts`)

- 각 포스트 행에 썸네일 미리보기 추가 (`resolveThumbnail()` 사용)

### 외부 블로그 포스트 목록

- 카드/리스트에 썸네일 표시 (`resolveThumbnail()` 사용)

### 블로그 포스트 상세

- 포스트 하단에 태그 표시: `#Next.js #React #TypeScript`

---

## 폴백 우선순위

```
thumbnail_url (명시적 설정)
  → content 내 첫 번째 이미지 src
    → /images/fallback-thumbnail.jpg
```
