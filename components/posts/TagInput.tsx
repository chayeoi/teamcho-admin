'use client'

import { KeyboardEvent, useRef, useState } from 'react'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
}

export function TagInput({ value, onChange }: TagInputProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#+/, '')
    if (!tag || value.includes(tag)) return
    onChange([...value, tag])
    setInput('')
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  return (
    <div className="rounded-xl border border-[#EBEBEB] px-7 py-5">
      <p className="text-[13px] font-semibold text-[#111111] mb-3">태그</p>

      <div
        className="flex flex-wrap items-center gap-1.5 min-h-[36px] px-3 py-2 rounded-lg border border-[#EBEBEB] bg-white cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F2F2F2] text-[12.5px] font-medium text-[#444444]"
          >
            #{tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(tag) }}
              className="text-[#AAAAAA] hover:text-[#555555] transition-colors bg-transparent border-none cursor-pointer p-0 leading-none font-[inherit]"
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (input) addTag(input) }}
          placeholder={value.length === 0 ? '태그 입력 후 엔터 또는 쉼표' : ''}
          className="flex-1 min-w-[120px] border-none outline-none text-[13px] text-[#111111] bg-transparent placeholder:text-[#CCCCCC]"
        />
      </div>

      <p className="text-[12px] text-[#AAAAAA] mt-1.5">엔터 또는 쉼표(,)로 추가</p>
    </div>
  )
}
