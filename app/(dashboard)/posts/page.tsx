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

  const [supabase, posts] = await Promise.all([
    createClient(),
    getPosts(validFilter),
  ])
  const { data: { user } } = await supabase.auth.getUser()

  const allPosts = await getPosts('all')
  const counts = {
    all: allPosts.length,
    draft: allPosts.filter(p => p.status === 'draft').length,
    published: allPosts.filter(p => p.status === 'published').length,
    scheduled: allPosts.filter(p => p.status === 'scheduled').length,
  }

  const userName = user?.email?.split('@')[0] ?? '관리자'
  const today = format(new Date(), 'yyyy년 M월 d일 (eee)', { locale: ko })

  const stats = [
    {
      label: '전체 포스트',
      value: counts.all,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
      ),
      iconBg: '#F0F0F0',
      iconColor: '#555555',
    },
    {
      label: '초안',
      value: counts.draft,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      ),
      iconBg: '#FFF8E6',
      iconColor: '#B45309',
    },
    {
      label: '발행됨',
      value: counts.published,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      ),
      iconBg: '#F0FDF4',
      iconColor: '#15803D',
    },
    {
      label: '예약됨',
      value: counts.scheduled,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
      ),
      iconBg: '#F5F3FF',
      iconColor: '#6D28D9',
    },
  ]

  return (
    <div style={{ padding: '32px 32px 48px', minHeight: '100vh' }}>

      {/* ── 헤더 ── */}
      <div
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
        style={{ marginBottom: '28px' }}
      >
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: '700',
            color: '#111111',
            letterSpacing: '-0.03em',
            margin: '0 0 5px',
            lineHeight: '1.2',
          }}>
            안녕하세요, {userName}님 👋
          </h1>
          <p style={{ fontSize: '13.5px', color: '#999999', margin: 0, fontWeight: '400' }}>
            블로그 포스트를 작성하고 관리해요
          </p>
        </div>

        {/* 날짜 + 새 글 작성 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 14px',
            backgroundColor: '#FFFFFF',
            borderRadius: '10px',
            border: '1px solid #EBEBEB',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontSize: '12.5px', fontWeight: '500', color: '#666666', whiteSpace: 'nowrap' }}>
              {today}
            </span>
          </div>

          <Link href="/posts/new" style={{ textDecoration: 'none' }}>
            <button style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              background: 'linear-gradient(135deg, #1A1A1A 0%, #2E2E2E 100%)',
              color: '#FFFFFF',
              padding: '9px 18px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              letterSpacing: '-0.01em',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              새 글 작성
            </button>
          </Link>
        </div>
      </div>

      {/* ── 통계 카드 ── */}
      <div
        className="grid grid-cols-2 md:grid-cols-4"
        style={{ gap: '14px', marginBottom: '24px' }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '20px 22px',
              border: '1px solid #EBEBEB',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: stat.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              color: stat.iconColor,
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{
                fontSize: '11px',
                fontWeight: '600',
                color: '#AAAAAA',
                letterSpacing: '0.04em',
                marginBottom: '4px',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: '26px',
                fontWeight: '700',
                color: '#111111',
                letterSpacing: '-0.03em',
                lineHeight: '1',
              }}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 포스트 목록 카드 ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EBEBEB',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {/* 카드 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px 0',
        }}>
          <div>
            <span style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#111111',
              letterSpacing: '-0.02em',
            }}>
              포스트 목록
            </span>
            {counts.all > 0 && (
              <span style={{
                marginLeft: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#AAAAAA',
              }}>
                총 {counts.all}개
              </span>
            )}
          </div>
          <FilterTabs currentFilter={validFilter} />
        </div>

        <PostList posts={posts} />
      </div>
    </div>
  )
}
