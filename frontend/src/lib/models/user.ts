export enum Roles {
  admin= 'admin',
  user = 'user',
  nn = 'nn',
}

export type User = {
  id: number
  email: string
  name: string
  role: Roles
  active: boolean
  createdAt?: string
}

export type UserWithToken = {
  user: User
  token: string
}
