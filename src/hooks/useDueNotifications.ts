import { useEffect, useRef, useState } from 'react'
import type { Todo } from '../types'

const LEAD_TIME_MS = 5 * 60 * 1000
const CHECK_INTERVAL_MS = 15 * 1000

function isSupported() {
  return typeof window !== 'undefined' && 'Notification' in window
}

export function useDueNotifications(
  todos: Todo[],
  markNotified: (ids: string[]) => void,
) {
  const [permission, setPermission] = useState<NotificationPermission>(
    isSupported() ? Notification.permission : 'denied',
  )
  const todosRef = useRef(todos)
  todosRef.current = todos

  function requestPermission() {
    if (!isSupported()) return
    Notification.requestPermission().then(setPermission)
  }

  useEffect(() => {
    if (!isSupported()) return

    function check() {
      if (Notification.permission !== 'granted') return
      const now = Date.now()
      const due = todosRef.current.filter(
        (t) =>
          t.dueAt &&
          !t.done &&
          !t.notified &&
          new Date(t.dueAt).getTime() - now <= LEAD_TIME_MS,
      )
      if (due.length === 0) return

      due.forEach((t) => {
        new Notification('할일 알림', {
          body: `${t.text} — 5분 후 마감`,
          icon: '/icon-192.png',
          tag: t.id,
        })
      })
      markNotified(due.map((t) => t.id))
    }

    check()
    const id = setInterval(check, CHECK_INTERVAL_MS)
    return () => clearInterval(id)
  }, [markNotified])

  return { permission, requestPermission, supported: isSupported() }
}
