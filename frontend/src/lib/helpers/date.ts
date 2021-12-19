/**
 * Returns the current date (UTC)
 * with the format "yyyy-mm-dd"
 */
export function nowUTC(): string {
  const now = new Date()
  const y = now.getUTCFullYear()
  const m = now.getUTCMonth() + 1
  const d = now.getUTCDate()
  return `${y}-${m}-${d}`
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
