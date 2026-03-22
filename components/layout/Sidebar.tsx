'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { label: 'Posts', href: '/posts', icon: '✦' },
  ]

  return (
    <aside style={{
      width: '240px',
      minHeight: '100vh',
      backgroundColor: '#141414',
      borderRight: '1px solid #262626',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'fixed',
      left: 0,
      top: 0,
    }}>
      {/* 로고 */}
      <div style={{ padding: '0 24px 32px' }}>
        <span style={{
          fontFamily: 'var(--font-lora, serif)',
          fontSize: '20px',
          fontWeight: '600',
          color: '#E8D5B0',
          letterSpacing: '0.05em',
        }}>
          ADMIN
        </span>
        <div style={{ fontSize: '11px', color: '#555', marginTop: '4px', letterSpacing: '0.1em' }}>
          EDITORIAL STUDIO
        </div>
      </div>

      {/* 구분선 */}
      <div style={{ borderBottom: '1px solid #262626', marginBottom: '16px' }} />

      {/* 네비게이션 */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 12px',
                borderRadius: '6px',
                color: isActive ? '#E8D5B0' : '#888',
                backgroundColor: isActive ? '#1A1A1A' : 'transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? '500' : '400',
                transition: 'all 0.15s ease',
                marginBottom: '2px',
              }}
            >
              <span style={{ fontSize: '10px' }}>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* 구분선 */}
      <div style={{ borderBottom: '1px solid #262626', margin: '16px 0' }} />

      {/* 로그아웃 */}
      <div style={{ padding: '0 12px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 12px',
            borderRadius: '6px',
            color: '#666',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: '10px' }}>→</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
