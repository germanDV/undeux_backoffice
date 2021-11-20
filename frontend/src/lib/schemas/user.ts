import * as yup from 'yup'

export enum Roles {
  admin= 'admin',
  user = 'user',
  nn = 'nn',
}

const emailValidator = yup
  .string()
  .email('Ingresá un email válido.')
  .required('Ingresá tu email.')

const passwordValidator = yup
  .string()
  .min(12, 'Mínimo 12 caracteres.')
  .max(32, 'Máximo 32 caracteres.')
  .required('Ingresá tu password.')

const nameValidator = yup
  .string()
  .min(2, 'Mínimo 2 caracteres.')
  .max(32, 'Máximo 32 caracteres.')
  .required('Ingresá tu nombre.')

const roleValidator = yup
  .mixed()
  .oneOf(['admin', 'user', 'nn'])
  .required('Seleccioná un rol.')

export const loginSchema = yup.object({
  email: emailValidator,
  password: passwordValidator,
})

export const registrationSchema = yup.object({
  email: emailValidator,
  name: nameValidator,
  role: roleValidator,
  password: passwordValidator,
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords no coinciden.')
    .required('Ingresá tu password.'),
})

export const passwordChangeSchema = yup.object({
  password: passwordValidator,
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords no coinciden.')
    .required('Ingresá tu password.'),
})

export const myPasswordSchema = yup.object({
  oldPassword: passwordValidator,
  newPassword: passwordValidator,
  newPasswordConfirmation: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords no coinciden.')
    .required('Ingresá tu password.'),
})

type Login = yup.InferType<typeof loginSchema>
type Registration = yup.InferType<typeof registrationSchema>
type PasswordChange = yup.InferType<typeof myPasswordSchema>
type Sensitive = { password: string; passwordConfirmation: string }
type User = Omit<Registration, keyof Sensitive> & { id: number, active: boolean }
type UserWithToken = { user: User; token: string }

export type { User, UserWithToken, Login, Registration, Sensitive, PasswordChange }

