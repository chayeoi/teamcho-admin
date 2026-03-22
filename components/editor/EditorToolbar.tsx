'use client'

import { type Editor } from '@tiptap/react'
import { useRef } from 'react'

interface EditorToolbarProps {
  editor: Editor | null
  onImageUpload: (file: File) => Promise<void>
}

interface ToolbarButtonProps {
  onClick: () => void
  isActive?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, isActive, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={[
        'px-2 py-1.5 rounded text-[#888] hover:text-white hover:bg-[#1F1F1F] transition-colors text-sm font-medium',
        isActive ? 'bg-[#1F1F1F] text-[#E8D5B0]' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="border-l border-[#333] mx-1 h-5 self-center" />
}

export default function EditorToolbar({ editor, onImageUpload }: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  function handleLinkClick() {
    const previousUrl = editor?.getAttributes('link').href as string | undefined
    const url = window.prompt('URL을 입력하세요:', previousUrl ?? '')

    if (url === null) return

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor
      ?.chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  function handleImageClick() {
    fileInputRef.current?.click()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await onImageUpload(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#141414] border-b border-[#262626]">
      {/* Text formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="굵게 (Bold)"
      >
        <strong>B</strong>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="기울임 (Italic)"
      >
        <em>I</em>
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive('underline')}
        title="밑줄 (Underline)"
      >
        <span style={{ textDecoration: 'underline' }}>U</span>
      </ToolbarButton>

      <Divider />

      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="제목 1 (H1)"
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="제목 2 (H2)"
      >
        H2
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="제목 3 (H3)"
      >
        H3
      </ToolbarButton>

      <Divider />

      {/* Text alignment */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="왼쪽 정렬"
      >
        ≡
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="가운데 정렬"
      >
        ≡
      </ToolbarButton>

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="오른쪽 정렬"
      >
        ≡
      </ToolbarButton>

      <Divider />

      {/* Link */}
      <ToolbarButton
        onClick={handleLinkClick}
        isActive={editor.isActive('link')}
        title="링크 삽입"
      >
        🔗
      </ToolbarButton>

      {/* Image */}
      <ToolbarButton onClick={handleImageClick} title="이미지 삽입">
        🖼
      </ToolbarButton>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
