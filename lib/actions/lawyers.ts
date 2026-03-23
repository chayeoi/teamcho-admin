'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type LawyerApplicationStatus = 'pending' | 'approved' | 'rejected'

export type LawyerApplication = {
  id: string
  name: string
  email: string
  bar_number: string
  status: LawyerApplicationStatus
  applied_at: string
  reviewed_at: string | null
  reviewer_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getLawyerApplications(
  status?: LawyerApplicationStatus
): Promise<LawyerApplication[]> {
  const supabase = await createClient()

  // super_admin 권한 검증
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.user_metadata?.role !== 'super_admin') {
    return []
  }

  let query = supabase
    .from('lawyer_applications')
    .select('*')
    .order('applied_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    console.error('getLawyerApplications error:', error)
    return []
  }

  return data || []
}

export async function reviewApplication(
  id: string,
  action: 'approved' | 'rejected',
  notes?: string
): Promise<{ error: string | null }> {
  const supabase = await createClient()

  // super_admin 권한 재검증
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.user_metadata?.role !== 'super_admin') {
    return { error: '권한이 없습니다.' }
  }

  const { error } = await supabase
    .from('lawyer_applications')
    .update({
      status: action,
      reviewed_at: new Date().toISOString(),
      reviewer_id: user.id,
      notes: notes ?? null,
    })
    .eq('id', id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/lawyers')
  return { error: null }
}
