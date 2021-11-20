import * as yup from 'yup'

export interface ShareholderRegistration {
  name: string
}

export const shareholderSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(32, 'Máximo 32 caracteres.')
    .required('Ingresá tu nombre.'),
})

