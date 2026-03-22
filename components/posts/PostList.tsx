'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Post, deletePost, toggleVisibility } from '@/lib/actions/posts'
import { PostStatusBadge } from './PostStatusBadge'

interface PostListProps {
  posts: Post[]
}

function formatDate(date: string | null): string {
  if (!date) return '-'
  return format(new Date(date), 'yyyy.MM.dd HH:mm')
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
      <div className="border border-[#262626] rounded-lg overflow-hidden">
        <div className="bg-[#0F0F0F] px-6 py-12 text-center text-[#666] text-sm">
          아직 작성된 포스트가 없습니다
        </div>
      </div>
    )
  }

  return (
    <div className="border border-[#262626] rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-[#141414]">
          <TableRow className="border-b border-[#1A1A1A] hover:bg-[#141414]">
            <TableHead className="text-[#666] text-xs uppercase tracking-wider">제목</TableHead>
            <TableHead className="text-[#666] text-xs uppercase tracking-wider">상태</TableHead>
            <TableHead className="text-[#666] text-xs uppercase tracking-wider">노출여부</TableHead>
            <TableHead className="text-[#666] text-xs uppercase tracking-wider">발행일</TableHead>
            <TableHead className="text-[#666] text-xs uppercase tracking-wider">수정일</TableHead>
            <TableHead className="text-[#666] text-xs uppercase tracking-wider">액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow
              key={post.id}
              className="bg-[#0F0F0F] hover:bg-[#141414] transition-colors border-b border-[#1A1A1A]"
            >
              <TableCell className="text-white font-medium text-sm">
                {post.title}
              </TableCell>
              <TableCell>
                <PostStatusBadge status={post.status} />
              </TableCell>
              <TableCell>
                <button
                  onClick={() => handleToggleVisibility(post.id)}
                  className={`text-sm ${post.is_visible ? 'text-[#60A5FA]' : 'text-[#888]'}`}
                >
                  {post.is_visible ? '노출' : '숨김'}
                </button>
              </TableCell>
              <TableCell className="text-[#888] text-sm">
                {formatDate(post.published_at)}
              </TableCell>
              <TableCell className="text-[#888] text-sm">
                {formatDate(post.updated_at)}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/posts/${post.id}/edit`}
                    className="text-[#E8D5B0] hover:text-[#D4BC8A] text-sm"
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-[#666] hover:text-red-400 text-sm"
                  >
                    삭제
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
