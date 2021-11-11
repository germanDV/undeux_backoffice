import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { UserWithToken, User, Shareholder } from 'lib/models'
import { RegistrationValues } from 'lib/schemas'
import * as auth from 'lib/auth'

async function client<T>(cfg: AxiosRequestConfig): Promise<T> {
  const { method, url, headers, data, ...config } = cfg
  const token = auth.getToken()

  try {
    const resp: AxiosResponse<T> = await axios({
      method: method || 'GET',
      url,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...headers,
      },
      data: ['POST', 'PUT', 'PATCH'].includes((method || '').toUpperCase()) ? data : null,
      ...config,
    })
    return resp.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const err = error.response?.data
      // @ts-ignore
      const msg = err && err.error ? err.error : error.message
      throw new Error(msg)
    }
    throw error
  }
}

export async function register(payload: Omit<RegistrationValues, 'passwordConfirmation'>) {
  return client<{id: number}>({
    method: 'POST',
    url: '/api/register',
    data: payload,
  })
}

export async function login(email: string, password: string) {
  return client<UserWithToken>({
    method: 'POST',
    url: '/api/login',
    data: { email, password },
  })
}

export async function me() {
  return client<{user: User}>({
    method: 'GET',
    url: '/api/me',
  })
}

export async function fetchUsers() {
  return client<{users: User[]}>({
    method: 'GET',
    url: '/api/users',
  })
}

export async function changeUserStatus(payload: { userId: number, active: boolean }) {
  return client<{message: string}>({
    method: 'PUT',
    url: '/api/users/status',
    data: payload,
  })
}

export async function makeAdmin(userId: number) {
  return client<{message: string}>({
    method: 'PUT',
    url: '/api/users/upgrade',
    data: { userId },
  })
}

export async function changeUserPassword(payload: { id: number, password: string }) {
  return client<{message: string}>({
    method: 'PUT',
    url: '/api/users/change-user-password',
    data: payload,
  })
}

export async function changeMyPassword(payload: { oldPassword: string, newPassword: string }) {
  return client<{message: string}>({
    method: 'PUT',
    url: '/api/users/change-my-password',
    data: payload,
  })
}

export async function fetchShareholders() {
  return client<{shareholders: Shareholder[]}>({
    method: 'GET',
    url: '/api/shareholders',
  })
}

export async function fetchShareholder(id: number) {
  return client<{shareholder: Shareholder}>({
    method: 'GET',
    url: `/api/shareholders/${id}`,
  })
}

