import { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent, Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { cn } from '@/lib/utils'

const TEXT_COLORS = [
    { label: 'Default', value: '' },
    { label: 'Gray', value: '#6B7280' },
    { label: 'Brown', value: '#92400E' },
    { label: 'Orange', value: '#F97316' },
    { label: 'Yellow', value: '#CA8A04' },
    { label: 'Green', value: '#16A34A' },
    { label: 'Blue', value: '#2563EB' },
    { label: 'Purple', value: '#9333EA' },
    { label: 'Pink', value: '#DB2777' },
    { label: 'Red', value: '#DC2626' },
]

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
    editable?: boolean
}

const SLASH_COMMANDS = [
    {
        id: 'text',
        label: 'Text',
        description: '普通文字段落',
        icon: 'T',
        action: (editor: Editor, range: { from: number; to: number }) => {
            editor.chain().focus().deleteRange(range).setParagraph().run()
        },
    },
    {
        id: 'h1',
        label: 'Heading 1',
        description: '大標題',
        icon: 'H1',
        action: (editor: Editor, range: { from: number; to: number }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run()
        },
    },
    {
        id: 'h2',
        label: 'Heading 2',
        description: '中標題',
        icon: 'H2',
        action: (editor: Editor, range: { from: number; to: number }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run()
        },
    },
    {
        id: 'h3',
        label: 'Heading 3',
        description: '小標題',
        icon: 'H3',
        action: (editor: Editor, range: { from: number; to: number }) => {
            editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run()
        },
    },
    {
        id: 'bullet',
        label: 'Bulleted List',
        description: '無序清單',
        icon: '•',
        action: (editor: Editor, range: { from: number; to: number }) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run()
        },
    },
    {
        id: 'ordered',
        label: 'Numbered List',
        description: '有序清單',
        icon: '1.',
        action: (editor: Editor, range: { from: number; to: number }) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run()
        },
    },
]

export const RichTextEditor = ({ content, onChange, editable = true }: RichTextEditorProps) => {
    const [showColorPicker, setShowColorPicker] = useState(false)
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const slashRangeRef = useRef<{ from: number; to: number } | null>(null)
    const slashMenuRef = useRef<{
        query: string
        selectedIndex: number
        top: number
        left: number
    } | null>(null)
    const [slashMenu, setSlashMenu] = useState<{
        query: string
        selectedIndex: number
        top: number
        left: number
    } | null>(null)

    // 保持 slashMenuRef 同步
    useEffect(() => {
        slashMenuRef.current = slashMenu
    }, [slashMenu])

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder: '寫下你的旅遊心得...',
            }),
            Underline,
            TextStyle,
            Color,
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())

            const { selection } = editor.state
            const { $from } = selection
            const textBefore = $from.parent.textContent.slice(0, $from.parentOffset)

            // 找最後一個 /
            const slashIdx = textBefore.lastIndexOf('/')
            if (slashIdx !== -1) {
                const query = textBefore.slice(slashIdx + 1)
                // 不含空格才觸發選單
                if (!query.includes(' ')) {
                    const from = selection.from - query.length - 1
                    const to = selection.from
                    slashRangeRef.current = { from, to }

                    const coords = editor.view.coordsAtPos(from)
                    const containerRect = editorContainerRef.current?.getBoundingClientRect()
                    if (containerRect) {
                        setSlashMenu({
                            query: query.toLowerCase(),
                            selectedIndex: 0,
                            top: coords.bottom - containerRect.top + 4,
                            left: coords.left - containerRect.left,
                        })
                        return
                    }
                }
            }
            setSlashMenu(null)
            slashRangeRef.current = null
        },
        editorProps: {
            attributes: {
                class: [
                    'focus:outline-none',
                    'min-h-[200px]',
                    'h-full',
                    'px-5',
                    'py-4',
                    'text-base',
                    'text-gray-800',
                    'leading-[1.6]',
                    '[&_p]:mb-2',
                    '[&_p]:mt-0',
                    '[&_h1]:text-2xl',
                    '[&_h1]:font-bold',
                    '[&_h1]:mb-3',
                    '[&_h1]:mt-1',
                    '[&_h1]:text-gray-900',
                    '[&_h2]:text-xl',
                    '[&_h2]:font-bold',
                    '[&_h2]:mb-2',
                    '[&_h2]:mt-1',
                    '[&_h2]:text-gray-900',
                    '[&_h3]:text-lg',
                    '[&_h3]:font-semibold',
                    '[&_h3]:mb-2',
                    '[&_h3]:mt-1',
                    '[&_h3]:text-gray-900',
                    '[&_ul]:pl-5',
                    '[&_ul]:list-disc',
                    '[&_ul]:mb-2',
                    '[&_ul]:mt-0',
                    '[&_ul_li]:mb-1',
                    '[&_ul_li]:leading-[1.6]',
                    '[&_ul_li_p]:mb-0',
                    '[&_ol]:pl-5',
                    '[&_ol]:list-decimal',
                    '[&_ol]:mb-2',
                    '[&_ol]:mt-0',
                    '[&_ol_li]:mb-1',
                    '[&_ol_li]:leading-[1.6]',
                    '[&_strong]:font-semibold',
                    '[&_strong]:text-gray-900',
                    '[&_a]:text-blue-600',
                    '[&_a]:underline',
                    '[&_a]:cursor-pointer',
                    '[&_.is-editor-empty:first-child::before]:text-gray-400',
                    '[&_.is-editor-empty:first-child::before]:float-left',
                    '[&_.is-editor-empty:first-child::before]:pointer-events-none',
                    '[&_.is-editor-empty:first-child::before]:h-0',
                ].join(' '),
            },
            handleKeyDown: (_view, event) => {
                const menu = slashMenuRef.current
                if (!menu) return false

                const filtered = SLASH_COMMANDS.filter(
                    c =>
                        c.label.toLowerCase().includes(menu.query) ||
                        c.description.includes(menu.query)
                )
                if (filtered.length === 0) return false

                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setSlashMenu(prev =>
                        prev
                            ? { ...prev, selectedIndex: (prev.selectedIndex + 1) % filtered.length }
                            : null
                    )
                    return true
                }
                if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    setSlashMenu(prev =>
                        prev
                            ? {
                                  ...prev,
                                  selectedIndex:
                                      (prev.selectedIndex - 1 + filtered.length) % filtered.length,
                              }
                            : null
                    )
                    return true
                }
                if (event.key === 'Enter' && slashRangeRef.current) {
                    event.preventDefault()
                    const cmd = filtered[menu.selectedIndex]
                    if (cmd && editor) {
                        cmd.action(editor, slashRangeRef.current)
                        setSlashMenu(null)
                        slashRangeRef.current = null
                    }
                    return true
                }
                if (event.key === 'Escape') {
                    setSlashMenu(null)
                    slashRangeRef.current = null
                    return true
                }
                return false
            },
        },
    })

    // Sync content when prop changes (e.g. switching places)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    if (!editor) {
        return null
    }

    if (!editable) {
        return <EditorContent editor={editor} className="prose prose-sm max-w-none text-gray-700 leading-relaxed" />
    }

    return (
        <div ref={editorContainerRef} className="relative bg-[#F8F9FA] rounded-2xl overflow-visible h-full">
            {/* Bubble Menu - 選取文字時顯示 */}
            <BubbleMenu
                editor={editor}
                className="flex items-center gap-0.5 bg-gray-900 text-white rounded-lg shadow-xl px-1.5 py-1 border border-gray-700"
            >
                {/* 文字類型選單 */}
                <div className="relative">
                    <select
                        className="bg-transparent text-white text-xs font-medium px-2 py-1 rounded cursor-pointer hover:bg-gray-700 transition-colors outline-none appearance-none pr-5"
                        value={
                            editor.isActive('heading', { level: 1 }) ? 'h1' :
                            editor.isActive('heading', { level: 2 }) ? 'h2' :
                            editor.isActive('heading', { level: 3 }) ? 'h3' :
                            editor.isActive('bulletList') ? 'bullet' :
                            editor.isActive('orderedList') ? 'ordered' :
                            'text'
                        }
                        onChange={(e) => {
                            const val = e.target.value
                            if (val === 'text') editor.chain().focus().setParagraph().run()
                            else if (val === 'h1') editor.chain().focus().setHeading({ level: 1 }).run()
                            else if (val === 'h2') editor.chain().focus().setHeading({ level: 2 }).run()
                            else if (val === 'h3') editor.chain().focus().setHeading({ level: 3 }).run()
                            else if (val === 'bullet') editor.chain().focus().toggleBulletList().run()
                            else if (val === 'ordered') editor.chain().focus().toggleOrderedList().run()
                        }}
                    >
                        <option value="text" className="bg-gray-900">Text</option>
                        <option value="h1" className="bg-gray-900">H1</option>
                        <option value="h2" className="bg-gray-900">H2</option>
                        <option value="h3" className="bg-gray-900">H3</option>
                        <option value="bullet" className="bg-gray-900">• Bulleted List</option>
                        <option value="ordered" className="bg-gray-900">1. Numbered List</option>
                    </select>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</span>
                </div>

                {/* 分隔線 */}
                <div className="w-px h-4 bg-gray-600 mx-0.5" />

                {/* Bold */}
                <button
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleBold().run() }}
                    className={cn(
                        'px-2 py-1 rounded text-sm font-bold transition-colors',
                        editor.isActive('bold') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'
                    )}
                >B</button>

                {/* Italic */}
                <button
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleItalic().run() }}
                    className={cn(
                        'px-2 py-1 rounded text-sm italic transition-colors',
                        editor.isActive('italic') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'
                    )}
                >I</button>

                {/* Underline */}
                <button
                    onMouseDown={(e) => { e.preventDefault(); editor.chain().focus().toggleUnderline().run() }}
                    className={cn(
                        'px-2 py-1 rounded text-sm underline transition-colors',
                        editor.isActive('underline') ? 'bg-gray-600 text-white' : 'hover:bg-gray-700'
                    )}
                >U</button>

                {/* 分隔線 */}
                <div className="w-px h-4 bg-gray-600 mx-0.5" />

                {/* Text Color */}
                <div className="relative">
                    <button
                        onMouseDown={(e) => { e.preventDefault(); setShowColorPicker(v => !v) }}
                        className="px-2 py-1 rounded hover:bg-gray-700 transition-colors text-xs font-bold flex flex-col items-center gap-0.5"
                        title="文字顏色"
                    >
                        <span>A</span>
                        <span
                            className="w-3.5 h-0.5 rounded-full"
                            style={{ backgroundColor: editor.getAttributes('textStyle').color || '#ffffff' }}
                        />
                    </button>
                    {showColorPicker && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-2 grid grid-cols-5 gap-1.5 z-50">
                            {TEXT_COLORS.map(c => (
                                <button
                                    key={c.label}
                                    title={c.label}
                                    onMouseDown={(e) => {
                                        e.preventDefault()
                                        if (c.value) {
                                            editor.chain().setColor(c.value).setTextSelection(editor.state.selection.to).run()
                                        } else {
                                            editor.chain().unsetColor().setTextSelection(editor.state.selection.to).run()
                                        }
                                        setShowColorPicker(false)
                                    }}
                                    className="w-8 h-8 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors border border-gray-600"
                                >
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: c.value || '#ffffff' }}
                                    >A</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </BubbleMenu>

            {/* Editor Content */}
            <EditorContent editor={editor} />

            {/* Slash Command Menu */}
            {slashMenu &&
                (() => {
                    const filtered = SLASH_COMMANDS.filter(
                        c =>
                            c.label.toLowerCase().includes(slashMenu.query) ||
                            c.description.includes(slashMenu.query)
                    )
                    if (filtered.length === 0) return null
                    return (
                        <div
                            className="absolute z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-1 w-56 overflow-hidden"
                            style={{ top: slashMenu.top, left: slashMenu.left }}
                        >
                            {filtered.map((cmd, idx) => (
                                <button
                                    key={cmd.id}
                                    className={cn(
                                        'w-full flex items-center gap-3 px-3 py-2 text-left transition-colors',
                                        idx === slashMenu.selectedIndex
                                            ? 'bg-gray-100'
                                            : 'hover:bg-gray-50'
                                    )}
                                    onMouseDown={e => {
                                        e.preventDefault()
                                        if (editor && slashRangeRef.current) {
                                            cmd.action(editor, slashRangeRef.current)
                                            setSlashMenu(null)
                                            slashRangeRef.current = null
                                        }
                                    }}
                                >
                                    <span className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg text-xs font-bold text-gray-600 shrink-0">
                                        {cmd.icon}
                                    </span>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">
                                            {cmd.label}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {cmd.description}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )
                })()}
        </div>
    )
}
