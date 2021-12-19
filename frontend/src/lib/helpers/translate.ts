/**
 * Translates a piece of text,
 * if no fallback is provided, it returns
 * the original "untranslated" text.
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
      return fallback || str
  }
}

