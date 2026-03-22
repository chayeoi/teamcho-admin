'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type PostStatus = 'draft' | 'published' | 'scheduled'

export type Post = {
  id: string
  title: string
  content: string
  status: PostStatus
  is_visible: boolean
  published_at: string | null
  scheduled_at: string | null
  created_at: string
  updated_at: string
  author_id: string | null
}

export async function getPosts(filter?: 'all' | PostStatus): Promise<Post[]> {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false })

  if (filter && filter !== 'all') {
    query = query.eq('status', filter)
  }

  const { data, error } = await query

  if (error) {
    console.error('getPosts error:', error)
    return []
  }

  return data || []
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('getPost error:', error)
    return null
  }

  return data
}

export async function createPost(data: {
  title: string
  content: string
}): Promise<{ data: Post | null; error: string | null }> {
  const supabase = await createClient()

  const { data: user } = await supabase.auth.getUser()

  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      title: data.title,
      content: data.content,
      status: 'draft',
      is_visible: true,
      author_id: user.user?.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/posts')
  return { data: post, error: null }
}

export async function updatePost(
  id: string,
  data: { title?: string; content?: string }
): Promise<{ data: Post | null; error: string | null }> {
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from('posts')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath('/posts')
  revalidatePath(`/posts/${id}/edit`)
  return { data: post, error: null }
}

export async function deletePost(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/posts')
  return { error: null }
}

export async function publishPost(
  id: string,
  scheduledAt?: Date
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  let updateData: Partial<Post>

  if (scheduledAt) {
    updateData = {
      status: 'scheduled',
      scheduled_at: scheduledAt.toISOString(),
    }
  } else {
    updateData = {
      status: 'published',
      published_at: new Date().toISOString(),
    }
  }

  const { error } = await supabase
    .from('posts')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/posts')
  return { error: null }
}

export async function toggleVisibility(id: string): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // 현재 값 조회
  const { data: post } = await supabase
    .from('posts')
    .select('is_visible')
    .eq('id', id)
    .single()

  if (!post) {
    return { error: 'Post not found' }
  }

  const { error } = await supabase
    .from('posts')
    .update({ is_visible: !post.is_visible })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/posts')
  return { error: null }
}
