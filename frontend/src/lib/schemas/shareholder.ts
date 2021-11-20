import * as yup from 'yup'

export const shareholderSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(32, 'Máximo 32 caracteres.')
    .required('Ingresá tu nombre.'),
})

type Shareholder = yup.InferType<typeof shareholderSchema> & { id: number }

export type { Shareholder }

