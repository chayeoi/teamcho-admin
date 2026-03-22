import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F5F7' }}>
      <Sidebar userEmail={user.email} />
      <main
        className="md:ml-[260px] pt-[52px] md:pt-0"
        style={{ flex: 1, minHeight: '100vh', backgroundColor: '#F4F5F7' }}
      >
        {children}
      </main>
    </div>
  )
}
