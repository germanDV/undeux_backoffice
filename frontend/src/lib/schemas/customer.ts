import * as yup from 'yup'

export const customerSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(32, 'Máximo 32 caracteres.')
    .required('Ingresá nombre de proveedor.'),
  notes: yup
    .string()
    .max(500, 'Máximo 500 caracteres.'),
  active: yup
    .bool(),
})

type Customer = yup.InferType<typeof customerSchema> & { id: number }

export type { Customer }


