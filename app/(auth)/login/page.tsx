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
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/posts')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md px-4">
      <div
        className="rounded-lg border p-10"
        style={{
          backgroundColor: '#141414',
          borderColor: '#262626',
        }}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1
            className="text-4xl tracking-widest mb-2"
            style={{
              fontFamily: 'var(--font-lora), Georgia, serif',
              color: '#E8D5B0',
            }}
          >
            Editorial
          </h1>
          <p className="text-sm" style={{ color: '#888888' }}>
            백오피스 관리자 로그인
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-sm"
              style={{ color: '#888888' }}
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@example.com"
              className="w-full rounded-md border px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#555555] focus:ring-1"
              style={{
                backgroundColor: '#0F0F0F',
                borderColor: '#333333',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#E8D5B0'
                e.currentTarget.style.boxShadow = '0 0 0 1px #E8D5B0'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#333333'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-sm"
              style={{ color: '#888888' }}
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full rounded-md border px-3 py-2 text-sm text-white outline-none transition-colors placeholder:text-[#555555]"
              style={{
                backgroundColor: '#0F0F0F',
                borderColor: '#333333',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#E8D5B0'
                e.currentTarget.style.boxShadow = '0 0 0 1px #E8D5B0'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#333333'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Error message */}
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            style={{
              backgroundColor: loading ? '#C4A87A' : '#E8D5B0',
              color: '#0F0F0F',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#D4BC8A'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#E8D5B0'
            }}
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
