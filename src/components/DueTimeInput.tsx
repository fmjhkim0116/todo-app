type AmPm = 'AM' | 'PM'

interface Parsed {
  date: string
  hour: number
  minute: number
  ampm: AmPm
}

const MINUTE_OPTIONS = [0, 10, 20, 30, 40, 50]
const HOUR_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1)

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function parseValue(value: string): Parsed {
  if (!value) return { date: '', hour: 12, minute: 0, ampm: 'AM' }
  const d = new Date(value)
  const date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
  const h24 = d.getHours()
  const ampm: AmPm = h24 < 12 ? 'AM' : 'PM'
  const hour = h24 % 12 || 12
  const roundedMinute = (Math.round(d.getMinutes() / 10) * 10) % 60
  return { date, hour, minute: roundedMinute, ampm }
}

function toIso(next: Parsed): string | undefined {
  if (!next.date) return undefined
  let hour24 = next.hour % 12
  if (next.ampm === 'PM') hour24 += 12
  const [y, m, d] = next.date.split('-').map(Number)
  return new Date(y, m - 1, d, hour24, next.minute, 0, 0).toISOString()
}

interface DueTimeInputProps {
  value: string
  onChange: (iso: string | undefined) => void
}

export function DueTimeInput({ value, onChange }: DueTimeInputProps) {
  const parsed = parseValue(value)

  function update(patch: Partial<Parsed>) {
    onChange(toIso({ ...parsed, ...patch }))
  }

  return (
    <div className="due-fields">
      <input
        type="date"
        className="due-date"
        value={parsed.date}
        onChange={(e) => update({ date: e.target.value })}
        aria-label="날짜"
      />
      <select
        className="due-part"
        value={parsed.hour}
        onChange={(e) => update({ hour: Number(e.target.value) })}
        aria-label="시"
      >
        {HOUR_OPTIONS.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <select
        className="due-part"
        value={parsed.minute}
        onChange={(e) => update({ minute: Number(e.target.value) })}
        aria-label="분"
      >
        {MINUTE_OPTIONS.map((m) => (
          <option key={m} value={m}>
            {pad(m)}
          </option>
        ))}
      </select>
      <select
        className="due-part"
        value={parsed.ampm}
        onChange={(e) => update({ ampm: e.target.value as AmPm })}
        aria-label="오전/오후"
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  )
}
