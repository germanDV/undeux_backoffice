export type User = {
  id: number
  email: string
  name: string
  role: string
}

export type UserWithToken = {
  user: User
  token: string
}
