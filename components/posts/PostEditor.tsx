'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { toast } from 'sonner'
import { createPost, updatePost } from '@/lib/actions/posts'
import { PublishDialog } from '@/components/posts/PublishDialog'
import { Button } from '@/components/ui/Button'

const TipTapEditor = dynamic(
  () => import('@/components/editor/TipTapEditor').then((m) => m.default),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[500px] bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-[#EBEBEB] border-t-[#111111] animate-spin" />
          <span className="text-[13px] text-[#AAAAAA]">에디터 불러오는 중...</span>
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
        toast.success('저장 완료')
      } else {
        const { data, error } = await createPost({ title, content })
        if (error || !data) { toast.error('저장 실패'); return }
        setPostId(data.id)
        toast.success('저장 완료')
        router.replace(`/posts/${data.id}/edit`)
      }
    })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── 상단 헤더 ── */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-[#EBEBEB] bg-white sticky top-0 z-20">
        {/* 브레드크럼 */}
        <div className="flex items-center gap-1.5 text-[13px]">
          <Link href="/posts" className="text-[#AAAAAA] no-underline font-medium">
            포스트
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span className="text-[#111111] font-semibold">
            {postId ? '글 수정' : '새 글 작성'}
          </span>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-2">
          {initialData?.status && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium text-[#AAAAAA] bg-[#F2F2F2]">
              {statusLabel[initialData.status] ?? initialData.status}
            </span>
          )}

          <Button
            variant="secondary"
            size="md"
            loading={isSaving}
            onClick={handleSave}
          >
            저장하기
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              if (!postId) { toast.error('먼저 저장을 해 주세요'); return }
              setPublishDialogOpen(true)
            }}
          >
            발행하기
          </Button>
        </div>
      </div>

      {/* ── 에디터 본문 ── */}
      <div className="max-w-[820px] mx-auto w-full px-6 pt-9 pb-20">

        {/* 제목 카드 */}
        <div className="bg-white rounded-xl border border-[#EBEBEB] px-7 py-[22px] mb-2.5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요..."
            className="w-full border-none outline-none text-[23px] font-bold text-[#111111] bg-transparent tracking-[-0.025em] leading-[1.35]"
          />
        </div>

        {/* 에디터 카드 */}
        <div className="bg-white rounded-xl border border-[#EBEBEB] overflow-hidden">
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
    </div>
  )
}
