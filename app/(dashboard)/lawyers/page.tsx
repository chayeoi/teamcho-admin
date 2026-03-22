import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLawyerApplications } from '@/lib/actions/lawyers'
import { LawyerApplicationList } from '@/components/lawyers/LawyerApplicationList'

export default async function LawyersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 서버 사이드 권한 이중 검증
  if (!user || user.user_metadata?.role !== 'super_admin') {
    redirect('/posts')
  }

  const applications = await getLawyerApplications('pending')

  return (
    <div style={{ padding: '32px 32px 48px', minHeight: '100vh' }}>

      {/* ── 헤더 ── */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#111111',
          letterSpacing: '-0.03em',
          margin: '0 0 5px',
          lineHeight: '1.2',
        }}>
          변호사 승인 관리
        </h1>
        <p style={{ fontSize: '13.5px', color: '#999999', margin: 0, fontWeight: '400' }}>
          변호사 회원 가입 신청을 검토하고 승인하세요
        </p>
      </div>

      {/* ── 신청 목록 카드 ── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #EBEBEB',
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {/* 카드 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px 0',
        }}>
          <div>
            <span style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#111111',
              letterSpacing: '-0.02em',
            }}>
              대기 중인 신청
            </span>
            {applications.length > 0 && (
              <span style={{
                marginLeft: '8px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#AAAAAA',
              }}>
                총 {applications.length}건
              </span>
            )}
          </div>
        </div>

        <LawyerApplicationList applications={applications} />
      </div>
    </div>
  )
}
