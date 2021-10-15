import * as yup from 'yup'

export interface LoginValues {
  email: string
  password: string
}

export const loginValidationSchema = yup.object({
  email: yup
    .string()
    .email('Ingresá un email válido.')
    .required('Ingresá tu email.'),
  password: yup
    .string()
    .min(12, 'Mínimo 12 caracteres.')
    .max(32, 'Máximo 32 caracteres.')
    .required('Ingresá tu password.'),
})
