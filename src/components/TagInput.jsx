import { useState } from 'react'

/**
 * TagInput component for adding/removing chips/tags
 * @param {Object} props
 * @param {string[]} props.tags - Array of current tags
 * @param {Function} props.onChange - Callback when tags change
 * @param {string} props.placeholder - Input placeholder
 */
function TagInput({ tags = [], onChange, placeholder = 'Type and press Enter...' }) {
    const [input, setInput] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const value = input.trim()
            if (value && !tags.includes(value)) {
                onChange([...tags, value])
                setInput('')
            }
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1))
        }
    }

    const removeTag = (indexToRemove) => {
        onChange(tags.filter((_, index) => index !== indexToRemove))
    }

    return (
        <div className="tag-input-container">
            <div className="tag-list">
                {tags.map((tag, index) => (
                    <span className="tag-chip" key={index}>
                        {tag}
                        <button
                            type="button"
                            className="tag-remove"
                            onClick={() => removeTag(index)}
                            aria-label={`Remove ${tag}`}
                        >
                            ✕
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    className="tag-input-field"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : ''}
                />
            </div>
        </div>
    )
}

export default TagInput
