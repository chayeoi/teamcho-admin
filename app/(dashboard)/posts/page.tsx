import { getPosts } from '@/lib/actions/posts'
import { PostList } from '@/components/posts/PostList'
import { FilterTabs } from './FilterTabs'
import Link from 'next/link'

interface PageProps {
  searchParams: Promise<{ filter?: string }>
}

export default async function PostsPage({ searchParams }: PageProps) {
  const { filter } = await searchParams
  const validFilter = ['all', 'draft', 'published', 'scheduled'].includes(filter || '')
    ? (filter as 'all' | 'draft' | 'published' | 'scheduled')
    : 'all'

  const posts = await getPosts(validFilter)

  return (
    <div style={{ padding: '48px', maxWidth: '1200px' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#F5F5F5', fontFamily: 'var(--font-lora, serif)', letterSpacing: '-0.02em' }}>
            Posts
          </h1>
          <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
            {posts.length}개의 포스트
          </p>
        </div>
        <Link href="/posts/new">
          <button style={{
            backgroundColor: '#E8D5B0',
            color: '#0F0F0F',
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}>
            새 글 작성
          </button>
        </Link>
      </div>

      {/* 필터 탭 */}
      <FilterTabs currentFilter={validFilter} />

      {/* 포스트 목록 */}
      <PostList posts={posts} />
    </div>
  )
}
