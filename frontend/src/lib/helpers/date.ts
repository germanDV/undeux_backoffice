import { compareAsc } from 'date-fns'

/**
 * Converts the Date obj to a string with format
 * "yyyy-mm-dd"
 */
export function dateToString(date: Date): string {
  const yyyy = date.getUTCFullYear()

  const m = date.getUTCMonth() + 1
  const mm = m < 10 ? `0${m}` : `${m}`

  const d = date.getUTCDate()
  const dd = d < 10 ? `0${d}` : `${d}`

  return `${yyyy}-${mm}-${dd}`
}

/**
 * Returns the current date (UTC)
 * with the format "yyyy-mm-dd"
 */
export function nowUTC(): string {
  const now = new Date()
  return dateToString(now)
}

/**
 * Returns the date with format "yyyy-mm-dd"
 * in local timezone.
 */
export function formatDate(date: string): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function sortByDateAsc<T extends { date: string }>(entries: T[]): T[] {
  entries.sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)
    return compareAsc(aDate, bDate)
  })
  return entries
}

