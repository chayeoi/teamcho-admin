'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ThumbnailPickerProps {
  value: string | null
  content: string
  onChange: (url: string | null) => void
}

export function ThumbnailPicker({ value, content, onChange }: ThumbnailPickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [showImageSelector, setShowImageSelector] = useState(false)

  const contentImages = extractImages(content)

  async function handleFileUpload(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (json.url) onChange(json.url)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="rounded-xl border border-[#EBEBEB] px-7 py-5">
      <p className="text-[13px] font-semibold text-[#111111] mb-3">썸네일 이미지</p>

      <div className="flex items-start gap-4">
        {/* 미리보기 */}
        <div className="w-[120px] h-[68px] rounded-lg border border-[#EBEBEB] bg-[#F5F5F5] flex-shrink-0 overflow-hidden relative">
          {value ? (
            <Image src={value} alt="썸네일" fill className="object-cover" unoptimized />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
        </div>

        {/* 액션 */}
        <div className="flex flex-col gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
          />

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              'px-3 py-1.5 rounded-lg border border-[#EBEBEB] text-[12.5px] font-medium text-[#555555] bg-white hover:bg-[#F5F5F5] transition-colors cursor-pointer font-[inherit] text-left',
              uploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            {uploading ? '업로드 중...' : '직접 업로드'}
          </button>

          {contentImages.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowImageSelector((v) => !v)}
                className="px-3 py-1.5 rounded-lg border border-[#EBEBEB] text-[12.5px] font-medium text-[#555555] bg-white hover:bg-[#F5F5F5] transition-colors cursor-pointer font-[inherit] text-left w-full flex items-center justify-between gap-2"
              >
                본문 이미지에서 선택
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {showImageSelector && (
                <div className="absolute top-full left-0 mt-1 z-10 bg-white border border-[#EBEBEB] rounded-xl shadow-lg p-2 flex flex-col gap-1 min-w-[180px]">
                  {contentImages.map((src, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => { onChange(src); setShowImageSelector(false) }}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-colors cursor-pointer font-[inherit] text-left bg-transparent border-none w-full"
                    >
                      <div className="w-10 h-6 rounded overflow-hidden bg-[#F5F5F5] flex-shrink-0 relative">
                        <Image src={src} alt="" fill className="object-cover" unoptimized />
                      </div>
                      <span className="text-[12px] text-[#555555] truncate max-w-[120px]">이미지 {i + 1}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange(null)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] font-medium text-[#CCCCCC] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer font-[inherit] text-left bg-transparent border-none"
            >
              제거
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function extractImages(content: string): string[] {
  const matches = [...content.matchAll(/<img[^>]+src=["']([^"']+)["']/g)]
  return matches.map((m) => m[1])
}
