/**
 * Translates a piece of text,
 * if fallback is not provided, defaults to empty string.
 */
export function tr(str: string, fallback = '') {
  switch (str.toLowerCase()) {
    case 'duplicate email':
      return 'Email ya registrado.'
    case 'inactive user account':
      return 'Usuario bloqueado.'
    case 'invalid credentials':
      return 'Email y/o password incorrecto.'
    case 'incorrect old password':
      return 'Password incorrecta'
    default:
      console.log(`Add translation for "${str}"`)
      return fallback
  }
}
