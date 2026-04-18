'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

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

  const inputClassName =
    'w-full px-[14px] py-[10px] text-sm text-[#111111] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[9px] outline-none transition-[border-color,box-shadow,background-color] duration-[120ms] font-[inherit] focus:border-[#111111] focus:bg-white focus:ring-2 focus:ring-black/5'

  return (
    <div className="w-full max-w-[380px] bg-white rounded-2xl border border-[#EBEBEB] px-8 py-9 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
      <div className="mb-7">
        <h1 className="text-[20px] font-bold text-[#111111] tracking-[-0.025em] mb-1.5">
          로그인
        </h1>
        <p className="text-[13.5px] text-[#AAAAAA]">
          관리자 계정으로 로그인해요
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-[14px]">
          <label className="block text-[13px] font-semibold text-[#333333] mb-[7px]">
            이메일
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
            className={inputClassName}
          />
        </div>

        <div className="mb-[22px]">
          <label className="block text-[13px] font-semibold text-[#333333] mb-[7px]">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className={inputClassName}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 px-[14px] py-[10px] bg-[#FEF2F2] border border-[#FECACA] rounded-[9px] mb-[14px]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-[13px] text-[#DC2626]">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full text-sm"
        >
          로그인 →
        </Button>
      </form>
    </div>
  )
}
