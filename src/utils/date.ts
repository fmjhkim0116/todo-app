export function formatDue(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const month = d.getMonth() + 1
  const day = d.getDate()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = d.getHours() < 12 ? 'AM' : 'PM'
  const hour12 = d.getHours() % 12 || 12
  return `${month}. ${day}. ${hour12}:${minutes} ${ampm}`
}

export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now()
}
