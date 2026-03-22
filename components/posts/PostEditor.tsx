'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { toast } from 'sonner'
import { createPost, updatePost } from '@/lib/actions/posts'
import { PublishDialog } from '@/components/posts/PublishDialog'

const TipTapEditor = dynamic(
  () => import('@/components/editor/TipTapEditor').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: '500px',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: '2px solid #EBEBEB',
            borderTopColor: '#111111',
            animation: 'spin 0.7s linear infinite',
          }} />
          <span style={{ fontSize: '13px', color: '#AAAAAA' }}>에디터 불러오는 중...</span>
        </div>
      </div>
    ),
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

const statusLabel: Record<string, string> = {
  draft: '초안',
  published: '발행됨',
  scheduled: '예약됨',
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
        if (error) { toast.error('저장 실패: ' + error); return }
        toast.success('임시저장 완료')
      } else {
        const { data, error } = await createPost({ title, content })
        if (error || !data) { toast.error('저장 실패'); return }
        setPostId(data.id)
        toast.success('임시저장 완료')
        router.replace(`/posts/${data.id}/edit`)
      }
    })
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>

      {/* ── 상단 헤더 ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: '56px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #EBEBEB',
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}>
        {/* 브레드크럼 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          <Link href="/posts" style={{ color: '#AAAAAA', textDecoration: 'none', fontWeight: '500' }}>
            포스트
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span style={{ color: '#111111', fontWeight: '600' }}>
            {postId ? '글 수정' : '새 글 작성'}
          </span>
        </div>

        {/* 액션 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {initialData?.status && (
            <span style={{
              fontSize: '11.5px',
              fontWeight: '600',
              color: '#AAAAAA',
              padding: '3px 9px',
              backgroundColor: '#F2F2F2',
              borderRadius: '20px',
            }}>
              {statusLabel[initialData.status] ?? initialData.status}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '7px 15px',
              fontSize: '13px',
              fontWeight: '600',
              color: isSaving ? '#AAAAAA' : '#555555',
              backgroundColor: 'transparent',
              border: '1px solid #E5E5E5',
              borderRadius: '8px',
              cursor: isSaving ? 'not-allowed' : 'pointer',
              transition: 'all 0.12s',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = '#F5F5F5'
                e.currentTarget.style.borderColor = '#CCCCCC'
              }
            }}
            onMouseLeave={(e) => {
              if (!isSaving) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#E5E5E5'
              }
            }}
          >
            {isSaving ? '저장 중...' : '임시저장'}
          </button>

          <button
            onClick={() => {
              if (!postId) { toast.error('먼저 임시저장을 해 주세요'); return }
              setPublishDialogOpen(true)
            }}
            style={{
              padding: '7px 18px',
              fontSize: '13px',
              fontWeight: '700',
              color: '#FFFFFF',
              background: 'linear-gradient(135deg, #1A1A1A 0%, #2E2E2E 100%)',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'all 0.12s',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            발행하기
          </button>
        </div>
      </div>

      {/* ── 에디터 본문 ── */}
      <div style={{ maxWidth: '820px', margin: '0 auto', padding: '36px 24px 80px' }}>

        {/* 제목 카드 */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EBEBEB',
          padding: '22px 28px',
          marginBottom: '10px',
        }}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '23px',
              fontWeight: '700',
              color: '#111111',
              backgroundColor: 'transparent',
              letterSpacing: '-0.025em',
              lineHeight: '1.35',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* 에디터 카드 */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          border: '1px solid #EBEBEB',
          overflow: 'hidden',
        }}>
          <TipTapEditor content={content} onChange={setContent} />
        </div>
      </div>

      {postId && (
        <PublishDialog
          postId={postId}
          open={publishDialogOpen}
          onOpenChange={setPublishDialogOpen}
          onSuccess={() => router.push('/posts')}
        />
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
