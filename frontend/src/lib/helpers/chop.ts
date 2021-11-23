/**
 * Truncates a string to the given length (defaults to 100),
 * and adds an ellipsis at the end (3 additional characters).
 */
export function chop(str: string | undefined, len = 100): string {
  if (!str) return ''
  if (str.length <= len) return str
  return `${str.substr(0, len)}...`
}

