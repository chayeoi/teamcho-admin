'use client'

import { type Editor } from '@tiptap/react'
import { useRef, useState, useEffect } from 'react'

interface EditorToolbarProps {
  editor: Editor | null
  onImageUpload: (file: File) => Promise<void>
}

function Btn({
  onClick, active, title, children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '30px',
        height: '28px',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12.5px',
        fontWeight: '600',
        backgroundColor: active ? '#EBEBEB' : 'transparent',
        color: active ? '#111111' : '#666666',
        transition: 'all 0.1s',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = '#F2F2F2'
          e.currentTarget.style.color = '#111111'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#666666'
        }
      }}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <div style={{ width: '1px', height: '18px', backgroundColor: '#E5E5E5', margin: '0 4px', flexShrink: 0 }} />
}

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const fileRef = useRef<HTMLInputElement>(null)
  const linkInputRef = useRef<HTMLInputElement>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  // 링크 입력 열릴 때 현재 링크 URL 불러오기 + 포커스
  useEffect(() => {
    if (showLinkInput && linkInputRef.current) {
      linkInputRef.current.focus()
    }
  }, [showLinkInput])

  if (!editor) return null

  function handleLinkButtonClick() {
    if (editor!.isActive('link')) {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    const currentHref = editor!.getAttributes('link').href as string | undefined
    setLinkUrl(currentHref ?? '')
    setShowLinkInput(true)
  }

  function applyLink() {
    const url = linkUrl.trim()
    if (!url) {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      const href = url.startsWith('http') ? url : `https://${url}`
      editor!.chain().focus().extendMarkRange('link').setLink({ href }).run()
    }
    setShowLinkInput(false)
    setLinkUrl('')
  }

  function cancelLink() {
    setShowLinkInput(false)
    setLinkUrl('')
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await onImageUpload(file)
    e.target.value = ''
  }

  return (
    <div style={{
      backgroundColor: '#FAFAFA',
      borderBottom: '1px solid #EBEBEB',
    }}>
      {/* ── 기본 툴바 ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '2px',
        padding: '8px 12px',
      }}>
        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="굵게">
          <strong>B</strong>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="기울임">
          <em>I</em>
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="밑줄">
          <span style={{ textDecoration: 'underline' }}>U</span>
        </Btn>

        <Sep />

        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="제목 1">H1</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="제목 2">H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="제목 3">H3</Btn>

        <Sep />

        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="왼쪽 정렬">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="17" y2="18"/></svg>
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="가운데 정렬">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="5" y1="18" x2="19" y2="18"/></svg>
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="오른쪽 정렬">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="7" y1="18" x2="21" y2="18"/></svg>
        </Btn>

        <Sep />

        {/* 링크 버튼: 활성 상태면 "링크 해제" 표시 */}
        <Btn onClick={handleLinkButtonClick} active={editor.isActive('link')} title={editor.isActive('link') ? '링크 해제' : '링크 삽입'}>
          {editor.isActive('link') ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/>
              <path d="M5.17 11.75l-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/>
              <line x1="8" y1="2" x2="8" y2="5"/>
              <line x1="2" y1="8" x2="5" y2="8"/>
              <line x1="16" y1="19" x2="16" y2="22"/>
              <line x1="19" y1="16" x2="22" y2="16"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          )}
        </Btn>

        <Btn onClick={() => fileRef.current?.click()} title="이미지 삽입">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
        </Btn>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* ── 링크 입력 바 (조건부 렌더링) ── */}
      {showLinkInput && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          backgroundColor: '#F8F8F8',
          borderTop: '1px solid #EBEBEB',
        }}>
          <span style={{ fontSize: '12px', color: '#888888', fontWeight: '500', flexShrink: 0 }}>
            링크 URL
          </span>
          <input
            ref={linkInputRef}
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); applyLink() }
              if (e.key === 'Escape') cancelLink()
            }}
            placeholder="https://example.com"
            style={{
              flex: 1,
              padding: '6px 10px',
              fontSize: '13px',
              color: '#111111',
              backgroundColor: '#FFFFFF',
              border: '1px solid #DDDDDD',
              borderRadius: '7px',
              outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.1s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#111111' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#DDDDDD' }}
          />
          <button
            onClick={applyLink}
            style={{
              padding: '6px 14px',
              fontSize: '12.5px',
              fontWeight: '600',
              color: '#FFFFFF',
              backgroundColor: '#111111',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
              transition: 'background-color 0.1s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333333'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111111'}
          >
            적용
          </button>
          <button
            onClick={cancelLink}
            style={{
              padding: '6px 12px',
              fontSize: '12.5px',
              fontWeight: '500',
              color: '#888888',
              backgroundColor: 'transparent',
              border: '1px solid #E5E5E5',
              borderRadius: '7px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            취소
          </button>
        </div>
      )}
    </div>
  )
}
