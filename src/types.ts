export interface Todo {
  id: string
  text: string
  done: boolean
  createdAt: number
  important: boolean
  dueAt?: string
  notified?: boolean
}
