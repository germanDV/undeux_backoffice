import * as yup from 'yup'
import { Roles } from '../models'

export interface RegistrationValues {
  name: string
  email: string
  password: string
  passwordConfirmation: string
  role: Roles
}

export const registrationValidationSchema = yup.object({
  email: yup
    .string()
    .email('Ingresá un email válido.')
    .required('Ingresá tu email.'),
  name: yup
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(32, 'Máximo 32 caracteres.')
    .required('Ingresá tu nombre.'),
  password: yup
    .string()
    .min(12, 'Mínimo 12 caracteres.')
    .max(32, 'Máximo 32 caracteres.')
    .required('Ingresá tu password.'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords no coinciden.')
    .required('Ingresá tu password.'),
  role: yup
    .mixed()
    .oneOf(['admin', 'user'])
    .required('Seleccioná un rol.'),
})
