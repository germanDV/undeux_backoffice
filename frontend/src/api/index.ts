import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { UserWithToken, User } from 'lib/models'
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
    throw error
  }
}

export async function login(email: string, password: string) {
  return client<UserWithToken>({
    method: 'POST',
    url: 'api/login',
    data: { email, password },
  })
}

export async function me() {
  return client<{user: User}>({
    method: 'GET',
    url: 'api/me',
  })
}

export async function fetchUsers() {
  return client<{users: User[]}>({
    method: 'GET',
    url: 'api/users',
  })
}
