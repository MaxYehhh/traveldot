import React, { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
}

export const TagInput: React.FC<TagInputProps> = ({ tags, onChange }) => {
    const [inputValue, setInputValue] = useState('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag()
        }
    }

    const addTag = () => {
        const trimmedValue = inputValue.trim()
        if (trimmedValue && !tags.includes(trimmedValue)) {
            onChange([...tags, trimmedValue])
            setInputValue('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter((tag) => tag !== tagToRemove))
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                {tags.map((tag) => (
                    <span
                        key={tag}
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium"
                    >
                        #{tag}
                        <button
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-900 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}
                <div className="flex-1 flex items-center gap-1">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? "Add tags..." : ""}
                        className="flex-1 border-none outline-none text-sm p-1 bg-transparent"
                    />
                    {inputValue && (
                        <button
                            onClick={addTag}
                            className="text-blue-600 hover:text-blue-800 p-1"
                        >
                            <Plus size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
