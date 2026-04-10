'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { UserRole, DEFAULT_ROLE } from '@/lib/types/roles'
import { cn } from '@/lib/utils'

interface SidebarProps {
  userEmail?: string
  userRole?: UserRole
}

const navItems = [
  {
    label: '홈',
    href: '/posts',
    exact: true,
    allowedRoles: ['super_admin', 'admin', 'operator'] as UserRole[],
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
    allowedRoles: ['super_admin', 'admin', 'operator'] as UserRole[],
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

  const visibleNavItems = navItems.filter(item =>
    item.allowedRoles.includes(userRole ?? DEFAULT_ROLE)
  )

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="flex flex-col h-full">

      {/* ── 로고 ── */}
      <div className="flex items-center justify-between px-6 pt-7 pb-6">
        <span className="text-[15px] font-bold text-[#111111] tracking-tight">
          관리자 대시보드
        </span>

        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-[7px] border border-[#E8E8E8] bg-transparent flex items-center justify-center cursor-pointer text-[#999999]"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── 네비게이션 ── */}
      <nav className="flex-1 overflow-y-auto px-4 py-1">
        {visibleNavItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href + '/')

          return (
            <div
              key={item.label}
              className="flex items-center justify-between mb-0.5"
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex-1 flex items-center gap-[11px] px-2.5 py-2.5 rounded-xl text-sm transition-colors no-underline',
                  isActive
                    ? 'text-[#111111] font-semibold'
                    : 'text-[#AAAAAA] font-normal hover:text-[#555555]'
                )}
              >
                <span className="flex flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>

            </div>
          )
        })}
      </nav>

      {/* ── 하단 ── */}
      <div className="px-4 pb-4">
        {/* 로그아웃 */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl text-sm text-[#AAAAAA] hover:text-red-600 bg-transparent border-none cursor-pointer font-normal text-left transition-colors font-[inherit]"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          로그아웃
        </button>

        {/* 유저 이메일 */}
        <div className="flex items-center gap-2.5 px-2.5 pt-2.5 pb-1 border-t border-[#F2F2F2] mt-1.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2A2A2A] to-[#555555] flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {getInitials(userEmail)}
          </div>
          <div className="overflow-hidden min-w-0">
            <div className="text-xs font-medium text-[#555555] whitespace-nowrap overflow-hidden text-ellipsis">
              {userEmail ?? '관리자'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar({ userEmail, userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* ── 데스크탑 사이드바 ── */}
      <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-[#EBEBEB] z-30">
        <SidebarContent userEmail={userEmail} userRole={userRole} />
      </aside>

      {/* ── 모바일 상단 바 ── */}
      <header className="flex md:hidden fixed top-0 left-0 right-0 h-[52px] bg-white border-b border-[#EBEBEB] items-center justify-between px-4 z-40">
        <span className="text-sm font-bold text-[#111111]">관리자</span>

        <button
          onClick={() => setIsOpen(true)}
          className="w-9 h-9 rounded-[9px] border border-[#E5E5E5] bg-white flex items-center justify-center cursor-pointer text-[#555555]"
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
        className={cn(
          'md:hidden fixed inset-0 bg-black/45 z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* ── 모바일 드로어 ── */}
      <aside
        className={cn(
          'md:hidden fixed top-0 bottom-0 left-0 w-[240px] bg-white border-r border-[#EBEBEB] z-[60] flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent userEmail={userEmail} userRole={userRole} onClose={() => setIsOpen(false)} />
      </aside>
    </>
  )
}
