'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { LawyerApplication, reviewApplication } from '@/lib/actions/lawyers'

interface LawyerApplicationListProps {
  applications: LawyerApplication[]
}

// th 스타일은 PostList.tsx와 동일하게
const th: React.CSSProperties = {
  padding: '11px 16px',
  fontSize: '11px',
  fontWeight: '700',
  color: '#AAAAAA',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  textAlign: 'left',
  backgroundColor: '#FAFAFA',
  borderBottom: '1px solid #EBEBEB',
  whiteSpace: 'nowrap',
}

function formatDate(date: string | null): string {
  if (!date) return '—'
  return format(new Date(date), 'yyyy.MM.dd')
}

export function LawyerApplicationList({ applications }: LawyerApplicationListProps) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  async function handleReview(id: string, action: 'approved' | 'rejected') {
    setLoadingId(id)
    await reviewApplication(id, action)
    router.refresh()
    setLoadingId(null)
  }

  if (applications.length === 0) {
    return (
      <div style={{ padding: '64px 24px', textAlign: 'center', borderTop: '1px solid #F2F2F2', marginTop: '16px' }}>
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#333333' }}>대기 중인 신청이 없어요</p>
        <p style={{ fontSize: '13px', color: '#AAAAAA', marginTop: '6px' }}>새로운 변호사 가입 신청이 들어오면 여기에 표시됩니다</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', borderTop: '1px solid #F2F2F2', marginTop: '16px' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...th, paddingLeft: '24px', width: '20%' }}>이름</th>
            <th style={th}>이메일</th>
            <th style={th}>등록번호</th>
            <th style={th}>신청일</th>
            <th style={{ ...th, paddingRight: '24px' }}>처리</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, idx) => (
            <tr
              key={app.id}
              style={{
                borderBottom: idx < applications.length - 1 ? '1px solid #F5F5F5' : 'none',
                transition: 'background-color 0.1s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <td style={{ padding: '14px 16px 14px 24px', fontSize: '13.5px', fontWeight: '600', color: '#111111' }}>
                {app.name}
              </td>
              <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555555' }}>
                {app.email}
              </td>
              <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555555' }}>
                {app.bar_number}
              </td>
              <td style={{ padding: '14px 16px', fontSize: '12.5px', color: '#888888', whiteSpace: 'nowrap' }}>
                {formatDate(app.applied_at)}
              </td>
              <td style={{ padding: '14px 24px 14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    onClick={() => handleReview(app.id, 'approved')}
                    disabled={loadingId === app.id}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      backgroundColor: loadingId === app.id ? '#CCCCCC' : '#111111',
                      border: 'none',
                      cursor: loadingId === app.id ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.1s',
                    }}
                  >
                    승인
                  </button>
                  <button
                    onClick={() => handleReview(app.id, 'rejected')}
                    disabled={loadingId === app.id}
                    style={{
                      padding: '5px 11px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#AAAAAA',
                      backgroundColor: 'transparent',
                      border: '1px solid #E5E5E5',
                      cursor: loadingId === app.id ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      transition: 'all 0.1s',
                    }}
                    onMouseEnter={(e) => {
                      if (loadingId !== app.id) {
                        e.currentTarget.style.color = '#DC2626'
                        e.currentTarget.style.borderColor = '#FECACA'
                        e.currentTarget.style.backgroundColor = '#FEF2F2'
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#AAAAAA'
                      e.currentTarget.style.borderColor = '#E5E5E5'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    거부
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
