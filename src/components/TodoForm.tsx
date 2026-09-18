import { useState } from 'react'
import type { FormEvent } from 'react'
import { DueTimeInput } from './DueTimeInput'

interface TodoFormProps {
  onAdd: (text: string, important: boolean, dueAt?: string) => void
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('')
  const [important, setImportant] = useState(false)
  const [due, setDue] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed, important, due || undefined)
    setText('')
    setImportant(false)
    setDue('')
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
        maxLength={200}
        aria-label="새 할 일"
      />
      <DueTimeInput value={due} onChange={(iso) => setDue(iso ?? '')} />
      <button
        type="button"
        className={`important-toggle${important ? ' active' : ''}`}
        aria-pressed={important}
        onClick={() => setImportant((v) => !v)}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2l1.8 3.7 4.1.6-3 2.9.7 4.1L8 11.4l-3.6 1.9.7-4.1-3-2.9 4.1-.6L8 2z"
            fill={important ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
        중요
      </button>
      <button type="submit" disabled={!text.trim()}>
        추가
      </button>
    </form>
  )
}
