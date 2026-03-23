import { getPosts } from '@/lib/actions/posts'
import { createClient } from '@/lib/supabase/server'
import { PostList } from '@/components/posts/PostList'
import { FilterTabs } from './FilterTabs'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface PageProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function PostsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams
  const validFilter = ['all', 'draft', 'published', 'scheduled'].includes(filter || '')
    ? (filter as 'all' | 'draft' | 'published' | 'scheduled')
    : 'all'

  const supabase = await createClient()
  
  const [{ data: { user } }, allPosts, posts] = await Promise.all([
    supabase.auth.getUser(),
    getPosts('all'),
    getPosts(validFilter),
  ])

  const counts = {
    all: allPosts.length,
    draft: allPosts.filter(p => p.status === 'draft').length,
    published: allPosts.filter(p => p.status === 'published').length,
    scheduled: allPosts.filter(p => p.status === 'scheduled').length,
  }

  const userName = user?.email?.split('@')[0] ?? '관리자'
  const today = format(new Date(), 'd MMM, yyyy', { locale: ko })

  const stats = [
    {
      label: '전체 포스트',
      value: counts.all,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
      sub: '포스트 전체',
    },
    {
      label: '초안',
      value: counts.draft,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      sub: '작성 중',
    },
    {
      label: '발행됨',
      value: counts.published,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      sub: '공개 중',
    },
    {
      label: '예약됨',
      value: counts.scheduled,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      sub: '발행 예약',
    },
  ]

  return (
    <div style={{ padding: '36px 36px 56px', minHeight: '100vh' }}>

      {/* ── 헤더 ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '6px',
      }}>
        <div>
          <h1 style={{
            fontSize: '30px',
            fontWeight: '700',
            color: '#111111',
            letterSpacing: '-0.035em',
            margin: '0 0 6px',
            lineHeight: '1.15',
          }}>
            안녕하세요, {userName}님
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0, paddingTop: '4px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '8px 14px',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #EBEBEB',
          }}>
            <span style={{ fontSize: '13px', fontWeight: '500', color: '#666666', whiteSpace: 'nowrap' }}>
              {today}
            </span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AAAAAA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
        </div>
      </div>

      {/* ── 구분선 ── */}
      <div style={{ height: '1px', backgroundColor: '#EBEBEB', margin: '24px 0' }} />

      {/* ── 통계 바 (divider 방식) ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EBEBEB',
        display: 'flex',
        marginBottom: '28px',
        overflow: 'hidden',
      }}>
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '24px 26px',
              borderLeft: i > 0 ? '1px solid #F0F0F0' : 'none',
            }}
          >
            {/* 아이콘 circle */}
            <div style={{
              width: '46px', height: '46px',
              borderRadius: '50%',
              backgroundColor: '#F5F5F5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              color: '#666666',
            }}>
              {stat.icon}
            </div>
            {/* 텍스트 */}
            <div>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#AAAAAA', marginBottom: '4px' }}>
                {stat.label}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{
                  fontSize: '28px', fontWeight: '700', color: '#111111',
                  letterSpacing: '-0.04em', lineHeight: '1',
                }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: '11.5px', color: '#CCCCCC', fontWeight: '400' }}>
                  {stat.sub}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 포스트 목록 ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EBEBEB',
        overflow: 'hidden',
      }}>
        {/* 카드 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 16px',
          borderBottom: '1px solid #F5F5F5',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#111111', letterSpacing: '-0.02em' }}>
              포스트 목록
            </span>
            {counts.all > 0 && (
              <span style={{
                padding: '2px 9px',
                backgroundColor: '#F2F2F2',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#888888',
              }}>
                {counts.all}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FilterTabs currentFilter={validFilter} />
            <Link href="/posts/new" style={{ textDecoration: 'none' }}>
              <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '7px 14px',
                backgroundColor: '#111111', color: '#FFFFFF',
                border: 'none', borderRadius: '8px',
                fontSize: '12.5px', fontWeight: '600',
                cursor: 'pointer', fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                새 글 작성
              </button>
            </Link>
          </div>
        </div>

        <PostList posts={posts} />
      </div>
    </div>
  )
}
