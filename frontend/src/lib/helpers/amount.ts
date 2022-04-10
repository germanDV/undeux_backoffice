/**
 * Formats a number returning a string with the
 * appropriate thousand separator based on the locale.
 */
export function formatAmount(n: number): string {
  return n.toLocaleString('es-AR')
}

// TODO: bring this from a service and allow to be set through UI.
const FX_USD = 200

/**
 * Convert from ARS to USD
 */
export function toUSD(ars: number): number {
  return Math.round(ars / FX_USD)
}
