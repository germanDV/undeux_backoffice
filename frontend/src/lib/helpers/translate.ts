/**
 * Translates a piece of text,
 * if fallback is not provided, defaults to empty string.
 */
export function translate(str: string, fallback = '') {
  console.log(`Add translation for "${str}"`)
  return fallback
}

/**
 * Takes an error and returns a user-friendly string.
 */
export function translateErr(err: Error): string {
  if (!err.message) return 'Error desconocido.'
  const original = err.message.toLowerCase()
  switch (original) {
    case 'duplicate email':
      return 'Email ya registrado.'
    default:
      return err.message
  }
}
