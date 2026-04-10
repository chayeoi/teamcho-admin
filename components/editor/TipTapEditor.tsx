'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import { TextStyle } from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Color from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

import EditorToolbar from './EditorToolbar'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      TextStyle,
      FontFamily,
      Color,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: '내용을 입력하세요...' }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose-editor focus:outline-none min-h-[500px]',
      },
    },
    immediatelyRender: false,
  })

  async function handleImageUpload(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const { url } = (await response.json()) as { url: string }
    editor?.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div className="flex flex-col flex-1">
      <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} className="prose-editor min-h-[500px] px-8 py-7 bg-white outline-none" />
      </div>
    </div>
  )
}
