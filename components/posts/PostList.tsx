'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { Post, deletePost, toggleVisibility } from '@/lib/actions/posts'
import { PostStatusBadge } from './PostStatusBadge'

interface PostListProps {
  posts: Post[]
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  return format(new Date(date), 'yyyy.MM.dd')
}

const th: React.CSSProperties = {
  padding: '11px 16px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#AAAAAA',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  textAlign: 'left',
  backgroundColor: '#FAFAFA',
  borderBottom: '1px solid #EBEBEB',
  whiteSpace: 'nowrap',
}

export function PostList({ posts }: PostListProps) {
  const router = useRouter()

  async function handleDelete(id: string) {
    if (!confirm('이 포스트를 삭제하시겠습니까?')) return
    await deletePost(id)
    router.refresh()
  }

  async function handleToggleVisibility(id: string) {
    await toggleVisibility(id)
    router.refresh()
  }

  if (posts.length === 0) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', borderTop: '1px solid #F2F2F2', marginTop: '16px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: '#F2F2F2',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>포스트가 없어요</p>
        <p style={{ fontSize: '13px', color: '#AAAAAA', marginTop: '6px' }}>새 글 작성 버튼을 눌러 첫 포스트를 작성해 보세요</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', borderTop: '1px solid #F2F2F2', marginTop: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...th, paddingLeft: '24px', width: '40%' }}>제목</th>
            <th style={th}>상태</th>
            <th style={th}>노출</th>
            <th style={th}>발행일</th>
            <th style={th}>수정일</th>
            <th style={{ ...th, paddingRight: '24px' }}>액션</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, idx) => (
            <tr
              key={post.id}
              style={{
                borderBottom: idx < posts.length - 1 ? '1px solid #F5F5F5' : 'none',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '14px 16px 14px 24px' }}>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#111111', lineHeight: '1.4' }}>
                  {post.title || (
                    <span style={{ color: '#CCCCCC', fontWeight: '400', fontStyle: 'italic' }}>
                      (제목 없음)
                    </span>
                  )}
                </div>
              </td>
              <td style={{ padding: '14px 16px' }}>
                <PostStatusBadge status={post.status} />
              </td>
              <td style={{ padding: '14px 16px' }}>
                <button
                  onClick={() => handleToggleVisibility(post.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: post.is_visible ? '#F2F2F2' : '#F5F5F5',
                    color: post.is_visible ? '#111111' : '#AAAAAA',
                    fontFamily: 'inherit',
                    transition: 'all 0.1s',
                  }}
                >
                  <span style={{
                    width: '5px', height: '5px', borderRadius: '50%', flexShrink: 0,
                    backgroundColor: post.is_visible ? '#111111' : '#CCCCCC',
                  }} />
                  {post.is_visible ? '노출' : '숨김'}
                </button>
              </td>
              <td style={{ padding: '14px 16px', fontSize: '12.5px', color: '#888888', whiteSpace: 'nowrap' }}>
                {formatDate(post.published_at)}
              </td>
              <td style={{ padding: '14px 16px', fontSize: '12.5px', color: '#888888', whiteSpace: 'nowrap' }}>
                {formatDate(post.updated_at)}
              </td>
              <td style={{ padding: '14px 24px 14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Link
                    href={`/posts/${post.id}/edit`}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#111111',
                      backgroundColor: '#F2F2F2',
                      textDecoration: 'none',
                      border: '1px solid #E5E5E5',
                      display: 'inline-block',
                      transition: 'all 0.1s',
                    }}
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#AAAAAA',
                      backgroundColor: 'transparent',
                      border: '1px solid #E5E5E5',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#DC2626'
                      e.currentTarget.style.borderColor = '#FECACA'
                      e.currentTarget.style.backgroundColor = '#FEF2F2'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#AAAAAA'
                      e.currentTarget.style.borderColor = '#E5E5E5'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
