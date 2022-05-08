import { compareAsc, compareDesc } from 'date-fns'
import { GridValueFormatterParams } from '@mui/x-data-grid'

/**
 * Converts the Date obj to a string with format
 * "yyyy-mm-dd"
 */
export function dateToString(date: Date | string): string {
  if (typeof date === 'string') return date

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
 * Returns the date formatted in local timezone.
 */
export function formatDate(date: string): string {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    // year: 'numeric',
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

export function sortByDateDesc<T extends { date: string }>(entries: T[]): T[] {
  entries.sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)
    return compareDesc(aDate, bDate)
  })
  return entries
}

/**
 * Formatter function to display dates in MUI's DataGrid.
 */
export function displayDateGridCell(cell: GridValueFormatterParams): string {
  return formatDate(cell.value as string)
}
