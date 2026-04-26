'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Post, deletePost, toggleVisibility } from '@/lib/actions/posts'
import { resolveThumbnail } from '@/lib/utils/thumbnail'
import { cn } from '@/lib/utils'

interface PostListProps {
  posts: Post[]
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  return format(new Date(date), 'yyyy.MM.dd')
}

const statusConfig = {
  draft: {
    label: '초안',
    dotColor: 'bg-[#F59E0B]',
    iconBg: 'bg-[#FFFBEB]',
    iconColor: 'text-[#B45309]',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  published: {
    label: '발행됨',
    dotColor: 'bg-[#10B981]',
    iconBg: 'bg-[#F0FDF4]',
    iconColor: 'text-[#059669]',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  scheduled: {
    label: '예약됨',
    dotColor: 'bg-[#8B5CF6]',
    iconBg: 'bg-[#F5F3FF]',
    iconColor: 'text-[#7C3AED]',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
}

export function PostList({ posts }: PostListProps) {
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm('이 포스트를 삭제할까요?')) return
    await deletePost(id)
    router.refresh()
  }

  async function handleToggleVisibility(id: string) {
    await toggleVisibility(id)
    router.refresh()
  }

  if (posts.length === 0) {
    return (
      <div className="py-16 px-6 text-center border-t border-[#F2F2F2] mt-4">
        <div className="w-12 h-12 bg-[#F5F5F5] rounded-[14px] flex items-center justify-center mx-auto mb-3.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <p className="text-sm font-semibold text-[#555555] m-0 mb-1.5">
          포스트가 없어요
        </p>
        <p className="text-[13px] text-[#BBBBBB] m-0">
          새 글 작성 버튼을 눌러 첫 포스트를 작성해 보세요
        </p>
      </div>
    )
  }

  return (
    <div>
      {posts.map((post, idx) => {
        const cfg = statusConfig[post.status] ?? statusConfig.draft
        const isLast = idx === posts.length - 1

        return (
          <div
            key={post.id}
            className={cn(
              'flex items-center gap-4 px-6 py-3.5 transition-colors hover:bg-[#FAFAFA]',
              !isLast && 'border-b border-[#F7F7F7]'
            )}
          >
            {/* 상태 아이콘 */}
            <div className={cn(
              'size-[38px] rounded-[10px] flex items-center justify-center flex-shrink-0',
              cfg.iconBg,
              cfg.iconColor
            )}>
              {cfg.icon}
            </div>

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

            {/* 제목 */}
            <div className="flex-1 min-w-0">
              <div className="text-[13.5px] font-medium text-[#111111] truncate">
                {post.title || (
                  <span className="text-[#CCCCCC] italic font-normal">
                    (제목 없음)
                  </span>
                )}
              </div>
            </div>

            {/* 상태 */}
            <div className="flex items-center gap-1.5 min-w-[72px]">
              <div className={cn('size-[7px] rounded-full flex-shrink-0', cfg.dotColor)} />
              <span className="text-[12.5px] text-[#888888] font-normal whitespace-nowrap">
                {cfg.label}
              </span>
            </div>

            {/* 노출 토글 */}
            <button
              onClick={() => handleToggleVisibility(post.id)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#EBEBEB] text-xs flex-shrink-0 transition-colors hover:bg-[#F5F5F5] bg-transparent cursor-pointer font-medium whitespace-nowrap font-[inherit]',
                post.is_visible ? 'text-[#555555]' : 'text-[#CCCCCC]'
              )}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {post.is_visible
                  ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                }
              </svg>
              {post.is_visible ? '노출' : '숨김'}
            </button>

            {/* 날짜 */}
            <div className="flex items-center gap-1 min-w-[90px] flex-shrink-0 text-xs text-[#BBBBBB]">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="whitespace-nowrap">
                {formatDate(post.published_at || post.updated_at)}
              </span>
            </div>

            {/* 액션 */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Link
                href={`/posts/${post.id}/edit`}
                className="px-3 py-1 rounded-lg text-xs font-medium text-[#555555] bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors no-underline whitespace-nowrap"
              >
                수정
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-3 py-1 rounded-lg text-xs font-medium text-[#CCCCCC] hover:text-red-500 hover:bg-red-50 transition-colors bg-transparent border-none cursor-pointer font-[inherit] whitespace-nowrap"
              >
                삭제
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
