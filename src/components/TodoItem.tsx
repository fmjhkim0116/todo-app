import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Todo } from '../types'
import { formatDue, isOverdue } from '../utils/date'
import { DueTimeInput } from './DueTimeInput'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onImportantChange: (id: string, important: boolean) => void
  onDueChange: (id: string, dueAt: string | undefined) => void
}

export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onImportantChange,
  onDueChange,
}: TodoItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })
  const [editingDue, setEditingDue] = useState(false)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const overdue = !!todo.dueAt && !todo.done && isOverdue(todo.dueAt)

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`todo-item${todo.important ? ' important' : ''}${todo.done ? ' done' : ''}${isDragging ? ' dragging' : ''}`}
    >
      <button
        type="button"
        className="drag-handle"
        aria-label="순서 변경"
        {...attributes}
        {...listeners}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="5" cy="4" r="1.2" fill="currentColor" />
          <circle cx="11" cy="4" r="1.2" fill="currentColor" />
          <circle cx="5" cy="8" r="1.2" fill="currentColor" />
          <circle cx="11" cy="8" r="1.2" fill="currentColor" />
          <circle cx="5" cy="12" r="1.2" fill="currentColor" />
          <circle cx="11" cy="12" r="1.2" fill="currentColor" />
        </svg>
      </button>

      <button
        type="button"
        className="check"
        role="checkbox"
        aria-checked={todo.done}
        aria-label="완료 표시"
        onClick={() => onToggle(todo.id)}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3 8.5L6.2 11.7L13 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="todo-body">
        <span className="todo-text">{todo.text}</span>

        {editingDue ? (
          <div className="due-edit-row">
            <DueTimeInput value={todo.dueAt ?? ''} onChange={(iso) => onDueChange(todo.id, iso)} />
            <button
              type="button"
              className="due-done-btn"
              aria-label="날짜/시간 편집 완료"
              onClick={() => setEditingDue(false)}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8.5L6.2 11.7L13 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : todo.dueAt ? (
          <div className="due-row">
            <button
              type="button"
              className={`due-badge${overdue ? ' overdue' : ''}`}
              title="클릭하여 날짜/시간 변경"
              onClick={() => setEditingDue(true)}
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path
                  d="M8 5v3.2L10 10"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{formatDue(todo.dueAt)}</span>
            </button>
            <button
              type="button"
              className="due-clear"
              aria-label="날짜/시간 제거"
              onClick={() => onDueChange(todo.id, undefined)}
            >
              ×
            </button>
          </div>
        ) : (
          <button type="button" className="set-time-btn" onClick={() => setEditingDue(true)}>
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
              <path
                d="M8 5v3.2L10 10"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>날짜/시간 설정</span>
          </button>
        )}
      </div>

      <button
        type="button"
        className={`important-toggle${todo.important ? ' active' : ''}`}
        aria-pressed={todo.important}
        aria-label="중요 표시"
        onClick={() => onImportantChange(todo.id, !todo.important)}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2l1.8 3.7 4.1.6-3 2.9.7 4.1L8 11.4l-3.6 1.9.7-4.1-3-2.9 4.1-.6L8 2z"
            fill={todo.important ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        </svg>
        중요
      </button>

      <button
        type="button"
        className="delete-btn"
        aria-label="삭제"
        onClick={() => onDelete(todo.id)}
      >
        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2.5 4.5H13.5M6 4.5V3a1 1 0 011-1h2a1 1 0 011 1v1.5M12.3 4.5L11.8 13a1 1 0 01-1 1H5.2a1 1 0 01-1-1L3.7 4.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </li>
  )
}
