export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  NN = 'NN',
}

export type User = {
  id: number
  email: string
  name: string
  role: Roles
}

export type UserWithToken = {
  user: User
  token: string
}
