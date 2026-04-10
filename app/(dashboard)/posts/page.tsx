import { getPosts } from '@/lib/actions/posts'
import { createClient } from '@/lib/supabase/server'
import { PostList } from '@/components/posts/PostList'
import { FilterTabs } from './FilterTabs'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { cn } from '@/lib/utils'

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
    <div className="min-h-screen p-9 pb-14">

      {/* ── 헤더 ── */}
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <h1 className="text-[30px] font-bold text-[#111111] tracking-[-0.035em] m-0 mb-1.5 leading-[1.15]">
            안녕하세요, {userName}님
          </h1>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 pt-1">
          <div className="flex items-center gap-2 px-3.5 py-2 bg-white rounded-[10px] border border-[#EBEBEB]">
            <span className="text-[13px] font-medium text-[#666666] whitespace-nowrap">
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
      <div className="h-px bg-[#EBEBEB] my-6" />

      {/* ── 통계 바 (divider 방식) ── */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] flex mb-7 overflow-hidden">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={cn(
              'flex-1 flex items-center gap-4 p-6',
              i > 0 && 'border-l border-[#F0F0F0]'
            )}
          >
            {/* 아이콘 circle */}
            <div className="size-[46px] rounded-full bg-[#F5F5F5] flex items-center justify-center flex-shrink-0 text-[#666666]">
              {stat.icon}
            </div>
            {/* 텍스트 */}
            <div>
              <div className="text-[12px] font-medium text-[#AAAAAA] mb-1">
                {stat.label}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[28px] font-bold text-[#111111] tracking-[-0.04em] leading-none">
                  {stat.value}
                </span>
                <span className="text-[11.5px] text-[#CCCCCC] font-normal">
                  {stat.sub}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 포스트 목록 ── */}
      <div className="bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden">
        {/* 카드 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-2.5">
            <span className="text-[16px] font-bold text-[#111111] tracking-[-0.02em]">
              포스트 목록
            </span>
            {counts.all > 0 && (
              <span className="px-[9px] py-0.5 bg-[#F2F2F2] rounded-[20px] text-[12px] font-semibold text-[#888888]">
                {counts.all}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <FilterTabs currentFilter={validFilter} />
            <Link href="/posts/new" className="no-underline">
              <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#111111] text-white border-none rounded-lg text-[12.5px] font-semibold cursor-pointer font-[inherit] whitespace-nowrap">
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
