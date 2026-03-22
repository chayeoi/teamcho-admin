'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않아요.')
      setLoading(false)
      return
    }

    router.push('/posts')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 14px',
    fontSize: '14px',
    color: '#111111',
    backgroundColor: '#FAFAFA',
    border: '1px solid #E5E5E5',
    borderRadius: '9px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.12s, box-shadow 0.12s, background-color 0.12s',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ width: '100%', maxWidth: '360px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '22px', fontWeight: '700', color: '#111111',
          letterSpacing: '-0.03em', margin: '0 0 8px',
        }}>
          다시 오셨군요 👋
        </h1>
        <p style={{ fontSize: '14px', color: '#AAAAAA', margin: 0 }}>
          관리자 계정으로 로그인해요
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '14px' }}>
          <label style={{
            display: 'block', fontSize: '13px', fontWeight: '600',
            color: '#333333', marginBottom: '7px',
          }}>
            이메일
          </label>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            required placeholder="admin@example.com" style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#111111'
              e.currentTarget.style.backgroundColor = '#FFFFFF'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E5E5E5'
              e.currentTarget.style.backgroundColor = '#FAFAFA'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        <div style={{ marginBottom: '22px' }}>
          <label style={{
            display: 'block', fontSize: '13px', fontWeight: '600',
            color: '#333333', marginBottom: '7px',
          }}>
            비밀번호
          </label>
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            required placeholder="••••••••" style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#111111'
              e.currentTarget.style.backgroundColor = '#FFFFFF'
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.06)'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E5E5E5'
              e.currentTarget.style.backgroundColor = '#FAFAFA'
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 14px', backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA', borderRadius: '9px', marginBottom: '14px',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontSize: '13px', color: '#DC2626', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          type="submit" disabled={loading}
          style={{
            width: '100%', padding: '11px',
            fontSize: '14px', fontWeight: '700', color: '#FFFFFF',
            background: loading ? '#888888' : 'linear-gradient(135deg, #1A1A1A 0%, #2E2E2E 100%)',
            border: 'none', borderRadius: '9px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 2px 8px rgba(0,0,0,0.2)',
            transition: 'all 0.15s', fontFamily: 'inherit',
          }}
        >
          {loading ? '로그인 중...' : '로그인 →'}
        </button>
      </form>
    </div>
  )
}
