/**
 * Formats a number returning a string with the
 * appropriate thousand separator based on the locale.
 */
export function formatAmount(n: number): string {
  return n.toLocaleString('es-AR')
}
