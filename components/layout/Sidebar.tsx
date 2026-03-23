'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface SidebarProps {
  userEmail?: string
}

function getInitials(email?: string) {
  if (!email) return 'A'
  return email.charAt(0).toUpperCase()
}

const navItems = [
  {
    label: '홈',
    href: '/posts',
    exact: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
        <polyline points="9 21 9 12 15 12 15 21"/>
      </svg>
    ),
  },
  {
    label: '포스트',
    href: '/posts',
    exact: false,
    hasAdd: true,
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        <line x1="9" y1="8" x2="15" y2="8"/>
        <line x1="9" y1="12" x2="14" y2="12"/>
      </svg>
    ),
  },
]

const bottomItems = [
  {
    label: '로그아웃',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
    ),
  },
]

function SidebarContent({
  userEmail,
  onClose,
}: {
  userEmail?: string
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── 로고 ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '28px 24px 24px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '30px', height: '30px',
            background: '#111111',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#111111', letterSpacing: '-0.025em' }}>
            관리자
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            style={{
              width: '28px', height: '28px', borderRadius: '7px',
              border: '1px solid #E8E8E8', backgroundColor: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#999999',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── 네비게이션 ── */}
      <nav style={{ flex: 1, padding: '4px 16px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href + '/')

          return (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2px',
              }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '11px',
                  padding: '9px 10px',
                  borderRadius: '9px',
                  textDecoration: 'none',
                  color: isActive ? '#111111' : '#AAAAAA',
                  fontWeight: isActive ? '600' : '400',
                  fontSize: '14px',
                  transition: 'color 0.12s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#555555'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#AAAAAA'
                }}
              >
                <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                {item.label}
              </Link>

              {item.hasAdd && (
                <Link
                  href="/posts/new"
                  onClick={onClose}
                  style={{
                    width: '24px', height: '24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    borderRadius: '6px',
                    color: '#BBBBBB',
                    textDecoration: 'none',
                    fontSize: '18px',
                    fontWeight: '300',
                    lineHeight: '1',
                    transition: 'color 0.12s, background-color 0.12s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F2F2F2'
                    e.currentTarget.style.color = '#555555'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#BBBBBB'
                  }}
                >
                  +
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── 하단 ── */}
      <div style={{ padding: '0 16px 16px' }}>
        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 10px', borderRadius: '9px',
            color: '#AAAAAA', backgroundColor: 'transparent', border: 'none',
            cursor: 'pointer', fontSize: '14px', fontWeight: '400',
            fontFamily: 'inherit', textAlign: 'left',
            transition: 'color 0.12s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#DC2626' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#AAAAAA' }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          로그아웃
        </button>

        {/* 유저 이메일 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '9px',
          padding: '10px 10px 4px',
          borderTop: '1px solid #F2F2F2',
          marginTop: '6px',
        }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #2A2A2A, #555555)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '11px', fontWeight: '700', color: 'white', flexShrink: 0,
          }}>
            {getInitials(userEmail)}
          </div>
          <div style={{ overflow: 'hidden', minWidth: 0 }}>
            <div style={{
              fontSize: '12px', fontWeight: '500', color: '#555555',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {userEmail ?? '관리자'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ userEmail }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* ── 데스크탑 사이드바 ── */}
      <aside
        className="hidden md:flex"
        style={{
          width: '240px',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          flexDirection: 'column',
          position: 'fixed',
          left: 0, top: 0, bottom: 0,
          borderRight: '1px solid #EBEBEB',
          zIndex: 30,
        }}
      >
        <SidebarContent userEmail={userEmail} />
      </aside>

      {/* ── 모바일 상단 바 ── */}
      <header
        className="flex md:hidden"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          height: '52px', backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EBEBEB',
          alignItems: 'center', justifyContent: 'space-between',
          padding: '0 16px', zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '26px', height: '26px', background: '#111111',
            borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111' }}>관리자</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '36px', height: '36px', borderRadius: '9px',
            border: '1px solid #E5E5E5', backgroundColor: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#555555',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      </header>

      {/* ── 오버레이 ── */}
      <div
        className="md:hidden"
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 50, opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ── 모바일 드로어 ── */}
      <aside
        className="md:hidden"
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0,
          width: '240px', backgroundColor: '#FFFFFF',
          zIndex: 60, borderRight: '1px solid #EBEBEB',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <SidebarContent userEmail={userEmail} onClose={() => setIsOpen(false)} />
      </aside>
    </>
  )
}
