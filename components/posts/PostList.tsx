'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Post, deletePost, toggleVisibility } from '@/lib/actions/posts'

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
    dotColor: '#F59E0B',
    iconBg: '#FFFBEB',
    iconColor: '#B45309',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
  },
  published: {
    label: '발행됨',
    dotColor: '#10B981',
    iconBg: '#F0FDF4',
    iconColor: '#059669',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  scheduled: {
    label: '예약됨',
    dotColor: '#8B5CF6',
    iconBg: '#F5F3FF',
    iconColor: '#7C3AED',
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
      <div style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{
          width: '48px', height: '48px',
          backgroundColor: '#F5F5F5',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#555555', margin: '0 0 6px' }}>
          포스트가 없어요
        </p>
        <p style={{ fontSize: '13px', color: '#BBBBBB', margin: 0 }}>
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
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px 24px',
              borderBottom: isLast ? 'none' : '1px solid #F7F7F7',
              transition: 'background-color 0.1s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {/* 상태 아이콘 */}
            <div style={{
              width: '38px', height: '38px',
              borderRadius: '10px',
              backgroundColor: cfg.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: cfg.iconColor,
              flexShrink: 0,
            }}>
              {cfg.icon}
            </div>

            {/* 제목 */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13.5px', fontWeight: '500', color: '#111111',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {post.title || (
                  <span style={{ color: '#CCCCCC', fontStyle: 'italic', fontWeight: '400' }}>
                    (제목 없음)
                  </span>
                )}
              </div>
            </div>

            {/* 상태 */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              minWidth: '72px',
            }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%', flexShrink: 0,
                backgroundColor: cfg.dotColor,
              }} />
              <span style={{ fontSize: '12.5px', color: '#888888', fontWeight: '400', whiteSpace: 'nowrap' }}>
                {cfg.label}
              </span>
            </div>

            {/* 노출 토글 */}
            <button
              onClick={() => handleToggleVisibility(post.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid #EBEBEB',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500',
                color: post.is_visible ? '#555555' : '#CCCCCC',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                transition: 'all 0.1s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F5F5F5' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
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
            <div style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              minWidth: '90px', flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ fontSize: '12px', color: '#BBBBBB', whiteSpace: 'nowrap' }}>
                {formatDate(post.published_at || post.updated_at)}
              </span>
            </div>

            {/* 액션 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
              <Link
                href={`/posts/${post.id}/edit`}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px', fontWeight: '500',
                  color: '#555555',
                  backgroundColor: '#F5F5F5',
                  textDecoration: 'none',
                  border: '1px solid transparent',
                  display: 'inline-block',
                  transition: 'all 0.1s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#EBEBEB'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F5F5F5'
                }}
              >
                수정
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '7px',
                  fontSize: '12px', fontWeight: '500',
                  color: '#CCCCCC',
                  backgroundColor: 'transparent',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.1s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#EF4444'
                  e.currentTarget.style.backgroundColor = '#FEF2F2'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#CCCCCC'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
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
