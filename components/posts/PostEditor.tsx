'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { toast } from 'sonner'
import { createPost, updatePost } from '@/lib/actions/posts'
import { PublishDialog } from '@/components/posts/PublishDialog'

// TipTap은 SSR 불가능하므로 dynamic import
const TipTapEditor = dynamic(
  () => import('@/components/editor/TipTapEditor').then((m) => m.default),
  {
    ssr: false,
    loading: () => <div style={{ minHeight: '500px', backgroundColor: '#0F0F0F' }} />,
  }
)

interface PostEditorProps {
  initialData?: {
    id?: string
    title: string
    content: string
    status: string
  }
}

export function PostEditor({ initialData }: PostEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [postId, setPostId] = useState(initialData?.id)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [isSaving, startSaving] = useTransition()
  const router = useRouter()

  async function handleSave() {
    startSaving(async () => {
      if (postId) {
        const { error } = await updatePost(postId, { title, content })
        if (error) {
          toast.error('저장 실패: ' + error)
          return
        }
        toast.success('저장되었습니다')
      } else {
        const { data, error } = await createPost({ title, content })
        if (error || !data) {
          toast.error('저장 실패: ' + (error || '알 수 없는 오류'))
          return
        }
        setPostId(data.id)
        toast.success('저장되었습니다')
        router.replace(`/posts/${data.id}/edit`)
      }
    })
  }

  return (
    <div style={{ backgroundColor: '#0F0F0F', minHeight: '100vh' }}>
      {/* 상단 헤더 툴바 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 48px',
          borderBottom: '1px solid #1A1A1A',
          backgroundColor: '#0F0F0F',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Link href="/posts" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>
          ← 목록으로
        </Link>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '6px 12px',
            }}
          >
            {isSaving ? '저장 중...' : '임시저장'}
          </button>
          <button
            onClick={() => {
              if (!postId) {
                toast.error('먼저 임시저장을 해주세요')
                return
              }
              setPublishDialogOpen(true)
            }}
            style={{
              backgroundColor: '#E8D5B0',
              color: '#0F0F0F',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            발행
          </button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 24px' }}>
        {/* 제목 입력 */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{
            width: '100%',
            backgroundColor: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '36px',
            fontWeight: '700',
            color: '#F5F5F5',
            fontFamily: 'var(--font-lora, serif)',
            marginBottom: '24px',
            letterSpacing: '-0.02em',
            lineHeight: '1.3',
          }}
        />

        {/* 구분선 */}
        <div style={{ borderBottom: '1px solid #1F1F1F', marginBottom: '32px' }} />

        {/* TipTap 에디터 */}
        <TipTapEditor content={content} onChange={setContent} />
      </div>

      {/* 발행 다이얼로그 */}
      {postId && (
        <PublishDialog
          postId={postId}
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
          onSuccess={() => router.push('/posts')}
        />
      )}
    </div>
  )
}
