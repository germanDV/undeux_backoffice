import * as yup from 'yup'

export const vendorSchema = yup.object({
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

type Vendor = yup.InferType<typeof vendorSchema> & { id: number }

export type { Vendor }

