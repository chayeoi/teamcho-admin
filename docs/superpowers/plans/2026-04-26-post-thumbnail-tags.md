# Post Thumbnail & Tags Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 포스트에 썸네일 이미지와 태그를 설정하는 기능을 추가하고, 관리자 목록 및 외부 블로그에 표시한다.

**Architecture:** `posts` 테이블에 `thumbnail_url text`와 `tags text[]` 컬럼을 추가하고, `resolveThumbnail()` 유틸로 표시 URL을 결정한다 (`thumbnail_url` → content 첫 이미지 → `/images/fallback-thumbnail.svg`). PostEditor에 `ThumbnailPicker`와 `TagInput` 컴포넌트를 통합한다.

**Tech Stack:** Next.js App Router, Supabase, TipTap, Tailwind CSS, shadcn/ui

---

## File Map

| 동작 | 경로 | 역할 |
|------|------|------|
| Create | `public/images/fallback-thumbnail.svg` | 썸네일 없을 때 폴백 이미지 |
| Create | `lib/utils/thumbnail.ts` | `getFirstImageFromContent`, `resolveThumbnail` |
| Modify | `lib/actions/posts.ts` | `Post` 타입 + `createPost`/`updatePost` 파라미터에 `thumbnail_url`, `tags` 추가 |
| Create | `components/posts/ThumbnailPicker.tsx` | 썸네일 직접 업로드 + 본문 이미지 선택 UI |
| Create | `components/posts/TagInput.tsx` | 태그 자유 입력 UI |
| Modify | `components/posts/PostEditor.tsx` | ThumbnailPicker, TagInput 통합 |
| Modify | `components/posts/PostList.tsx` | 관리자 목록에 썸네일 컬럼 추가 |

---

## Task 1: DB 마이그레이션 (수동)

**Files:** Supabase 대시보드 SQL 에디터

- [ ] **Step 1: Supabase 대시보드에서 SQL 실행**

Supabase 프로젝트 → SQL Editor에서 아래 쿼리 실행:

```sql
ALTER TABLE posts ADD COLUMN IF NOT EXISTS thumbnail_url text;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
```

- [ ] **Step 2: 컬럼 추가 확인**

Table Editor → posts 테이블에서 `thumbnail_url`, `tags` 컬럼이 추가됐는지 확인.

---

## Task 2: 폴백 썸네일 이미지 추가

**Files:**
- Create: `public/images/fallback-thumbnail.svg`

- [ ] **Step 1: public/images 디렉토리 생성 후 SVG 파일 작성**

```bash
mkdir -p /Users/charlie/admin/public/images
```

`public/images/fallback-thumbnail.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
  <rect width="800" height="450" fill="#F5F5F5"/>
  <rect x="320" y="165" width="160" height="120" rx="12" fill="#E0E0E0"/>
  <circle cx="355" cy="200" r="18" fill="#CCCCCC"/>
  <polyline points="320,285 370,235 410,265 450,220 480,285" fill="none" stroke="#CCCCCC" stroke-width="3" stroke-linejoin="round"/>
</svg>
```

- [ ] **Step 2: 커밋**

```bash
git add public/images/fallback-thumbnail.svg
git commit -m "feat: 썸네일 폴백 이미지 추가"
```

---

## Task 3: Post 타입 및 Server Actions 업데이트

**Files:**
- Modify: `lib/actions/posts.ts`

- [ ] **Step 1: Post 타입에 필드 추가**

`lib/actions/posts.ts`의 `Post` 타입을 아래로 교체:

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
  thumbnail_url: string | null
  tags: string[]
}
```

- [ ] **Step 2: createPost 파라미터 확장**

기존:
```typescript
export async function createPost(data: {
  title: string
  content: string
}): Promise<{ data: Post | null; error: string | null }> {
```

교체:
```typescript
export async function createPost(data: {
  title: string
  content: string
  thumbnail_url?: string | null
  tags?: string[]
}): Promise<{ data: Post | null; error: string | null }> {
```

insert 블록의 객체도 업데이트:
```typescript
    .insert({
      title: data.title,
      content: data.content,
      status: 'draft',
      is_visible: true,
      author_id: user.user?.id,
      thumbnail_url: data.thumbnail_url ?? null,
      tags: data.tags ?? [],
    })
```

- [ ] **Step 3: updatePost 파라미터 확장**

기존:
```typescript
export async function updatePost(
  id: string,
  data: { title?: string; content?: string }
```

교체:
```typescript
export async function updatePost(
  id: string,
  data: { title?: string; content?: string; thumbnail_url?: string | null; tags?: string[] }
```

- [ ] **Step 4: 커밋**

```bash
git add lib/actions/posts.ts
git commit -m "feat: Post 타입에 thumbnail_url, tags 필드 추가"
```

---

## Task 4: 썸네일 유틸 함수

**Files:**
- Create: `lib/utils/thumbnail.ts`

> **의존성:** Task 3 완료 후 실행 (Post 타입이 thumbnail_url 필드를 가져야 함)

- [ ] **Step 1: 파일 생성**

`lib/utils/thumbnail.ts`:

```typescript
import type { Post } from '@/lib/actions/posts'

export function getFirstImageFromContent(content: string): string | null {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : null
}

export function resolveThumbnail(
  post: Pick<Post, 'thumbnail_url' | 'content'>
): string {
  if (post.thumbnail_url) return post.thumbnail_url
  const first = getFirstImageFromContent(post.content)
  if (first) return first
  return '/images/fallback-thumbnail.svg'
}
```

- [ ] **Step 2: 커밋**

```bash
git add lib/utils/thumbnail.ts
git commit -m "feat: 썸네일 URL 결정 유틸 추가"
```

---

## Task 5: ThumbnailPicker 컴포넌트

**Files:**
- Create: `components/posts/ThumbnailPicker.tsx`

- [ ] **Step 1: 파일 생성**

`components/posts/ThumbnailPicker.tsx`:

```typescript
'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ThumbnailPickerProps {
  value: string | null
  content: string
  onChange: (url: string | null) => void
}

export function ThumbnailPicker({ value, content, onChange }: ThumbnailPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [showImageSelector, setShowImageSelector] = useState(false)

  const contentImages = extractImages(content)

  async function handleFileUpload(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (json.url) onChange(json.url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#EBEBEB] px-7 py-5">
      <p className="text-[13px] font-semibold text-[#111111] mb-3">썸네일 이미지</p>

      <div className="flex items-start gap-4">
        {/* 미리보기 */}
        <div className="w-[120px] h-[68px] rounded-lg border border-[#EBEBEB] bg-[#F5F5F5] flex-shrink-0 overflow-hidden relative">
          {value ? (
            <Image src={value} alt="썸네일" fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
        </div>

        {/* 액션 */}
        <div className="flex flex-col gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'px-3 py-1.5 rounded-lg border border-[#EBEBEB] text-[12.5px] font-medium text-[#555555] bg-white hover:bg-[#F5F5F5] transition-colors cursor-pointer font-[inherit] text-left',
              uploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {uploading ? '업로드 중...' : '직접 업로드'}
          </button>

          {contentImages.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowImageSelector((v) => !v)}
                className="px-3 py-1.5 rounded-lg border border-[#EBEBEB] text-[12.5px] font-medium text-[#555555] bg-white hover:bg-[#F5F5F5] transition-colors cursor-pointer font-[inherit] text-left w-full flex items-center justify-between gap-2"
              >
                본문 이미지에서 선택
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showImageSelector && (
                <div className="absolute top-full left-0 mt-1 z-10 bg-white border border-[#EBEBEB] rounded-xl shadow-lg p-2 flex flex-col gap-1 min-w-[180px]">
                  {contentImages.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { onChange(src); setShowImageSelector(false) }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors cursor-pointer font-[inherit] text-left bg-transparent border-none w-full"
                    >
                      <div className="w-10 h-6 rounded overflow-hidden bg-[#F5F5F5] flex-shrink-0 relative">
                        <Image src={src} alt="" fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-[12px] text-[#555555] truncate max-w-[120px]">이미지 {i + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-[#CCCCCC] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer font-[inherit] text-left bg-transparent border-none"
            >
              제거
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function extractImages(content: string): string[] {
  const matches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/g)]
  return matches.map((m) => m[1])
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/posts/ThumbnailPicker.tsx
git commit -m "feat: ThumbnailPicker 컴포넌트 추가"
```

---

## Task 6: TagInput 컴포넌트

**Files:**
- Create: `components/posts/TagInput.tsx`

- [ ] **Step 1: 파일 생성**

`components/posts/TagInput.tsx`:

```typescript
'use client'

import { KeyboardEvent, useRef, useState } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#+/, '')
    if (!tag || value.includes(tag)) return
    onChange([...value, tag])
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="rounded-xl border border-[#EBEBEB] px-7 py-5">
      <p className="text-[13px] font-semibold text-[#111111] mb-3">태그</p>

      <div
        className="flex flex-wrap items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-lg border border-[#EBEBEB] bg-white cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F2F2F2] text-[12.5px] font-medium text-[#444444]"
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="text-[#AAAAAA] hover:text-[#555555] transition-colors bg-transparent border-none cursor-pointer p-0 leading-none font-[inherit]"
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input) addTag(input) }}
          placeholder={value.length === 0 ? '태그 입력 후 엔터 또는 쉼표' : ''}
          className="flex-1 min-w-[120px] border-none outline-none text-[13px] text-[#111111] bg-transparent placeholder:text-[#CCCCCC]"
        />
      </div>

      <p className="text-[12px] text-[#AAAAAA] mt-1.5">엔터 또는 쉼표(,)로 추가</p>
    </div>
  )
}
```

- [ ] **Step 2: 커밋**

```bash
git add components/posts/TagInput.tsx
git commit -m "feat: TagInput 컴포넌트 추가"
```

---

## Task 7: PostEditor에 ThumbnailPicker, TagInput 통합

**Files:**
- Modify: `components/posts/PostEditor.tsx`

- [ ] **Step 1: import 추가 및 Props 업데이트**

파일 상단 import에 추가:
```typescript
import { ThumbnailPicker } from '@/components/posts/ThumbnailPicker'
import { TagInput } from '@/components/posts/TagInput'
```

`PostEditorProps` 타입 교체:
```typescript
interface PostEditorProps {
  initialData?: {
    id?: string
    title: string
    content: string
    status: string
    thumbnail_url?: string | null
    tags?: string[]
  }
}
```

- [ ] **Step 2: 상태 추가**

`PostEditor` 함수 내 기존 `useState` 선언들 아래에 추가:
```typescript
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialData?.thumbnail_url ?? null)
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
```

- [ ] **Step 3: handleSave에 thumbnail_url, tags 포함**

`updatePost` 호출 부분을:
```typescript
        const { error } = await updatePost(postId, { title, content })
```
아래로 교체:
```typescript
        const { error } = await updatePost(postId, { title, content, thumbnail_url: thumbnailUrl, tags })
```

`createPost` 호출 부분을:
```typescript
        const { data, error } = await createPost({ title, content })
```
아래로 교체:
```typescript
        const { data, error } = await createPost({ title, content, thumbnail_url: thumbnailUrl, tags })
```

- [ ] **Step 4: 에디터 본문에 ThumbnailPicker, TagInput 추가**

`/* 에디터 본문 */` 섹션 안에서 `/* 제목 카드 */` div 바로 위에 삽입:

```tsx
        {/* 썸네일 + 태그 카드 */}
        <div className="flex flex-col gap-2.5 mb-2.5">
          <ThumbnailPicker
            value={thumbnailUrl}
            content={content}
            onChange={setThumbnailUrl}
          />
          <TagInput value={tags} onChange={setTags} />
        </div>
```

- [ ] **Step 5: 커밋**

```bash
git add components/posts/PostEditor.tsx
git commit -m "feat: PostEditor에 썸네일, 태그 설정 UI 통합"
```

---

## Task 8: PostList에 썸네일 표시

**Files:**
- Modify: `components/posts/PostList.tsx`

- [ ] **Step 1: import 추가**

파일 상단에 추가:
```typescript
import Image from 'next/image'
import { resolveThumbnail } from '@/lib/utils/thumbnail'
```

- [ ] **Step 2: 썸네일 컬럼 추가**

각 포스트 row에서 `{/* 상태 아이콘 */}` div와 `{/* 제목 */}` div 사이에 삽입:

```tsx
            {/* 썸네일 */}
            <div className="w-[52px] h-[30px] rounded-md overflow-hidden bg-[#F5F5F5] flex-shrink-0 relative">
              <Image
                src={resolveThumbnail(post)}
                alt=""
                fill
                className="object-cover"
                unoptimized
              />
            </div>
```

- [ ] **Step 3: 커밋**

```bash
git add components/posts/PostList.tsx
git commit -m "feat: 포스트 목록에 썸네일 미리보기 추가"
```

---

## Task 9: next.config.ts 이미지 도메인 설정 확인

**Files:**
- Modify: `next.config.ts` (필요한 경우)

- [ ] **Step 1: Supabase Storage 도메인 확인**

`.env.local`에서 `NEXT_PUBLIC_SUPABASE_URL` 값 확인 후 hostname 추출.  
예: `https://abcxyz.supabase.co` → hostname은 `abcxyz.supabase.co`

- [ ] **Step 2: next.config.ts 확인 및 수정**

`next.config.ts`를 열어 `images.remotePatterns`에 Supabase hostname이 없으면 추가:

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
```

- [ ] **Step 3: 커밋 (변경사항 있을 경우)**

```bash
git add next.config.ts
git commit -m "feat: Supabase Storage 이미지 도메인 허용"
```
