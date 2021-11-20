import client from './client'
import { UserWithToken, User, Registration } from 'lib/schemas'

export async function register(payload: Omit<Registration, 'passwordConfirmation'>) {
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

