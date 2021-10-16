export type User = {
  id: number
  email: string
  name: string
  role: 'admin' | 'user' | 'nn'
}

export type UserWithToken = {
  user: User
  token: string
}
