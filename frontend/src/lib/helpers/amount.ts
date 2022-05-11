import { GridComparatorFn } from '@mui/x-data-grid'

/**
 * Formats a number returning a string with the
 * appropriate thousand separator based on the locale.
 */
export function formatAmount(n: number): string {
  return n.toLocaleString('es-AR')
}

/**
 * Sort amounts in DataGrid column
 */
export const sortAmounts: GridComparatorFn = (a, b) => {
  a = a ?? 0
  b = b ?? 0
  const aNum = a > 0 ? Number(String(a).replace('.', '')) : 0
  const bNum = b > 0 ? Number(String(b).replace('.', '')) : 0
  return aNum - bNum
}
