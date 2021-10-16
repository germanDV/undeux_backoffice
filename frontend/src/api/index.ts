import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import { UserWithToken, User } from 'lib/models'

type ApiResponse<T> = [T, string]

async function client<T>(cfg: AxiosRequestConfig): Promise<ApiResponse<T>> {
  const { method, url, headers, data, ...config } = cfg

  try {
    const resp: AxiosResponse<T> = await axios({
      method: method || 'GET',
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      data: ['POST', 'PUT', 'PATCH'].includes((method || '').toUpperCase()) ? data : null,
      ...config,
    })
    return [resp.data, '']
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return [{} as T, error.message]
    } else {
      return [{} as T, 'Something went wrong.']
    }
  }
}

export async function login(email: string, password: string) {
  return client<UserWithToken>({
    method: 'POST',
    url: 'api/login',
    data: { email, password },
  })
}

export async function me(token: string) {
  return client<{user: User}>({
    method: 'GET',
    url: 'api/me',
    headers: {
      Authorization: token,
    },
  })
}
