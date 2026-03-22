'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { UserRole, DEFAULT_ROLE } from '@/lib/types/roles'

interface SidebarProps {
  userEmail?: string
  userRole?: UserRole
}

const roleLabels: Record<UserRole, string> = {
  super_admin: '슈퍼 관리자',
  admin: '관리자',
  operator: '운영자',
}

const sections = [
  {
    label: null,
    items: [
      {
        label: '홈',
        href: '/posts',
        matchExact: true,
        allowedRoles: ['super_admin', 'admin', 'operator'] as UserRole[],
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
            <polyline points="9 21 9 12 15 12 15 21"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: '콘텐츠',
    items: [
      {
        label: '포스트',
        href: '/posts',
        matchExact: false,
        allowedRoles: ['super_admin', 'admin', 'operator'] as UserRole[],
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            <line x1="9" y1="8" x2="15" y2="8"/>
            <line x1="9" y1="12" x2="14" y2="12"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: '회원 관리',
    items: [
      {
        label: '변호사 승인',
        href: '/lawyers',
        matchExact: false,
        allowedRoles: ['super_admin'] as UserRole[],
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
            <polyline points="16 11 18 13 22 9"/>
          </svg>
        ),
      },
    ],
  },
]

function getInitials(email?: string) {
  if (!email) return 'A'
  return email.charAt(0).toUpperCase()
}

function SidebarContent({
  userEmail,
  userRole,
  onClose,
}: {
  userEmail?: string
  userRole?: UserRole
  onClose?: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()

  const visibleSections = sections
    .map(section => ({
      ...section,
      items: section.items.filter(item =>
        item.allowedRoles.includes(userRole ?? DEFAULT_ROLE)
      ),
    }))
    .filter(section => section.items.length > 0)

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
        padding: '22px 20px 18px',
      }}>
        <div style={{ fontSize: '15px', fontWeight: '700', color: '#111111', letterSpacing: '-0.02em' }}>
          관리자 대시보드
        </div>

        {/* 모바일 닫기 버튼 */}
        {onClose && (
          <button
            onClick={onClose}
            style={{
              width: '30px', height: '30px',
              borderRadius: '8px',
              border: '1px solid #E5E5E5',
              backgroundColor: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#888888',
              flexShrink: 0,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── 네비게이션 ── */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        {visibleSections.map((section) => (
          <div key={section.label ?? '_root'} style={{ marginBottom: '4px' }}>
            {section.label && (
              <div style={{
                fontSize: '10.5px',
                fontWeight: '700',
                color: '#BBBBBB',
                letterSpacing: '0.09em',
                padding: '8px 10px 4px',
              }}>
                {section.label}
              </div>
            )}
            {section.items.map((item) => {
              const isActive = item.matchExact
                ? pathname === item.href
                : pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 12px',
                    borderRadius: '9px',
                    color: isActive ? '#111111' : '#666666',
                    backgroundColor: isActive ? '#EAEAEA' : 'transparent',
                    textDecoration: 'none',
                    fontSize: '13.5px',
                    fontWeight: isActive ? '600' : '500',
                    transition: 'all 0.12s ease',
                    marginBottom: '2px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#EBEBEB'
                      e.currentTarget.style.color = '#111111'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#666666'
                    }
                  }}
                >
                  <span style={{ color: isActive ? '#111111' : '#AAAAAA', display: 'flex', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* ── 유저 프로필 + 로그아웃 ── */}
      <div style={{ padding: '12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 12px',
          borderRadius: '10px',
          backgroundColor: '#F4F5F7',
          marginBottom: '4px',
        }}>
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2A2A2A, #444444)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontSize: '13px', fontWeight: '700', color: 'white',
          }}>
            {getInitials(userEmail)}
          </div>
          <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '12.5px', fontWeight: '600', color: '#111111',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {userEmail?.split('@')[0] ?? '관리자'}
            </div>
            <div style={{ fontSize: '11px', color: '#AAAAAA', marginTop: '1px' }}>
              {roleLabels[userRole ?? DEFAULT_ROLE]}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            display: 'flex', alignItems: 'center', gap: '9px',
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#AAAAAA',
            backgroundColor: 'transparent',
            border: 'none', cursor: 'pointer',
            fontSize: '13px', fontWeight: '500',
            textAlign: 'left',
            transition: 'all 0.12s ease',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2'
            e.currentTarget.style.color = '#DC2626'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#AAAAAA'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          로그아웃
        </button>
      </div>
    </div>
  )
}

export function Sidebar({ userEmail, userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  // 모바일 메뉴 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* ── 데스크탑 사이드바 (md 이상) ── */}
      <aside
        className="hidden md:flex"
        style={{
          width: '260px',
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          flexDirection: 'column',
          position: 'fixed',
          left: 0, top: 0, bottom: 0,
          borderRight: '1px solid #EBEBEB',
        }}
      >
        <SidebarContent userEmail={userEmail} userRole={userRole} />
      </aside>

      {/* ── 모바일 상단 바 (md 미만) ── */}
      <header
        className="flex md:hidden"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '52px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EBEBEB',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 40,
        }}
      >
        {/* 로고 */}
        <span style={{ fontSize: '14px', fontWeight: '700', color: '#111111', letterSpacing: '-0.02em' }}>
          관리자 대시보드
        </span>

        {/* 햄버거 버튼 */}
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: '36px', height: '36px',
            borderRadius: '9px',
            border: '1px solid #E5E5E5',
            backgroundColor: '#FFFFFF',
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

      {/* ── 모바일 오버레이 backdrop ── */}
      <div
        className="md:hidden"
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.45)',
          zIndex: 50,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ── 모바일 드로어 ── */}
      <aside
        className="md:hidden"
        style={{
          position: 'fixed',
          top: 0, bottom: 0,
          left: 0,
          width: '260px',
          backgroundColor: '#FFFFFF',
          zIndex: 60,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isOpen ? '4px 0 24px rgba(0,0,0,0.12)' : 'none',
          borderRight: '1px solid #EBEBEB',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <SidebarContent userEmail={userEmail} userRole={userRole} onClose={() => setIsOpen(false)} />
      </aside>
    </>
  )
}
