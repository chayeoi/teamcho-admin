import { notFound } from 'next/navigation'
import { getPost } from '@/lib/actions/posts'
import { PostEditor } from '@/components/posts/PostEditor'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return (
    <PostEditor
      initialData={{
        id: post.id,
        title: post.title,
        content: post.content,
        status: post.status,
        thumbnail_url: post.thumbnail_url,
        tags: post.tags,
      }}
    />
  )
}
