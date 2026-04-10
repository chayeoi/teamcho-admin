import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { getUserRole } from '@/lib/types/roles'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const userRole = getUserRole(user.user_metadata)

  return (
    <div className="flex min-h-screen bg-[#F4F5F7]">
      <Sidebar userEmail={user.email} userRole={userRole} />
      <main className="md:ml-[240px] pt-[52px] md:pt-0 flex-1 min-h-screen bg-[#F4F5F7]">
        {children}
      </main>
    </div>
  )
}
