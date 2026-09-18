import { useCallback, useMemo } from 'react'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useDueNotifications } from './hooks/useDueNotifications'
import type { Todo } from './types'
import './App.css'

const STORAGE_KEY = 'todo-app.todos.v1'

function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// groups by completion then importance; stable, so manual drag order within a
// group survives being re-run after every add/toggle/delete/important change
function normalize(list: Todo[]): Todo[] {
  const byImportant = (arr: Todo[]) => [
    ...arr.filter((t) => t.important),
    ...arr.filter((t) => !t.important),
  ]
  const active = list.filter((t) => !t.done)
  const done = list.filter((t) => t.done)
  return [...byImportant(active), ...byImportant(done)]
}

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, [])

  // older saved todos predate the `important` field (some used a high/medium/low
  // priority instead) — map anything old to a plain boolean
  const safeTodos = useMemo(
    () =>
      todos.map((t) =>
        typeof t.important === 'boolean'
          ? t
          : { ...t, important: (t as unknown as { priority?: string }).priority === 'high' },
      ),
    [todos],
  )

  const orderedTodos = useMemo(() => normalize(safeTodos), [safeTodos])
  const remaining = safeTodos.filter((t) => !t.done).length

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function addTodo(text: string, important: boolean, dueAt?: string) {
    setTodos((prev) =>
      normalize([
        { id: createId(), text, done: false, createdAt: Date.now(), important, dueAt },
        ...prev,
      ]),
    )
  }

  function toggleTodo(id: string) {
    setTodos((prev) => normalize(prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))))
  }

  function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }

  function changeImportant(id: string, important: boolean) {
    setTodos((prev) => normalize(prev.map((t) => (t.id === id ? { ...t, important } : t))))
  }

  function changeDue(id: string, dueAt: string | undefined) {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, dueAt, notified: false } : t)))
  }

  const markNotified = useCallback(
    (ids: string[]) => {
      setTodos((prev) => prev.map((t) => (ids.includes(t.id) ? { ...t, notified: true } : t)))
    },
    [setTodos],
  )

  const { permission, requestPermission, supported } = useDueNotifications(
    safeTodos,
    markNotified,
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const list = normalize(safeTodos)
    const oldIndex = list.findIndex((t) => t.id === active.id)
    const newIndex = list.findIndex((t) => t.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    // only allow reordering within the same importance + completion group
    const dragged = list[oldIndex]
    const target = list[newIndex]
    if (dragged.done !== target.done || dragged.important !== target.important) return

    setTodos(normalize(arrayMove(list, oldIndex, newIndex)))
  }

  return (
    <div className="app">
      <header>
        <h1>할일 목록</h1>
        <div className="header-right">
          {supported && permission !== 'granted' && (
            <button
              type="button"
              className={`notify-btn${permission === 'denied' ? ' denied' : ''}`}
              onClick={requestPermission}
              disabled={permission === 'denied'}
              title={
                permission === 'denied'
                  ? '브라우저 설정에서 알림 권한을 허용해주세요'
                  : '마감 5분 전 알림 받기'
              }
            >
              <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M8 2.5c-1.8 0-3.2 1.4-3.2 3.2v1.9c0 .5-.2.9-.5 1.3L3 10.2c-.4.5 0 1.2.6 1.2h8.8c.6 0 1-.7.6-1.2l-1.3-1.3c-.3-.4-.5-.8-.5-1.3V5.7c0-1.8-1.4-3.2-3.2-3.2z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M6.5 12.5a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              {permission === 'denied' ? '알림 차단됨' : '알림 켜기'}
            </button>
          )}
          <span className="count">{remaining}개 남음</span>
        </div>
      </header>

      <TodoForm onAdd={addTodo} />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={orderedTodos.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="todo-list">
            {orderedTodos.length === 0 ? (
              <li className="empty">할 일을 추가해보세요.</li>
            ) : (
              orderedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onImportantChange={changeImportant}
                  onDueChange={changeDue}
                />
              ))
            )}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default App
