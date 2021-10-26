import * as yup from 'yup'

export interface PasswordChangeValues {
  password: string
  passwordConfirmation: string
}

export const passwordChangeValidationSchema = yup.object({
  password: yup
    .string()
    .min(12, 'Mínimo 12 caracteres.')
    .max(32, 'Máximo 32 caracteres.')
    .required('Ingresá tu password.'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords no coinciden.')
    .required('Ingresá tu password.'),
})
