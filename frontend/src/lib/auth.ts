import { login as apiLogin } from 'api'
import { User } from 'lib/models'

const LS_KEY = '__auth_token__'

export async function login(email: string, password: string): Promise<User> {
  try {
    const data = await apiLogin(email, password)
    const { token, user } = data
    window.localStorage.setItem(LS_KEY, token)
    return user
  } catch (err) {
    throw err
  }
}

export function logout() {
  window.localStorage.removeItem(LS_KEY)
}

export function getToken(): string {
  return window.localStorage.getItem(LS_KEY) || ''
}
