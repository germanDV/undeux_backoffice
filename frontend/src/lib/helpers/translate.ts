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
export function translateErr(err: Error, fallback = ''): string {
  if (!err.message) {
    return fallback || 'Error desconocido'
  }

  switch (err.message.toLowerCase()) {
    case 'duplicate email':
      return 'Email ya registrado.'
    case 'inactive user account':
      return 'Usuario bloqueado.'
    case 'invalid credentials':
      return 'Email y/o password incorrecto.'
    case 'incorrect old password':
      return 'Password incorrecta'
    default:
      return err.message
  }
}
