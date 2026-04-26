import type { Post } from '@/lib/actions/posts'

export function getFirstImageFromContent(content: string): string | null {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/)
  return match ? match[1] : null
}

export function resolveThumbnail(
  post: Pick<Post, 'thumbnail_url' | 'content'>
): string {
  if (post.thumbnail_url) return post.thumbnail_url
  const first = getFirstImageFromContent(post.content)
  if (first) return first
  return '/images/fallback-thumbnail.svg'
}
