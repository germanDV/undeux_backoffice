import * as yup from 'yup'

export const accountSchema = yup.object({
  currency: yup
    .string()
    .length(3, 'Debe constar de 3 caracteres.')
    .required('Campo obligatorio.'),
  balance: yup
    .number(),
  description: yup
    .string()
    .max(100, 'Máximo 100 caracteres.'),
})

type Account = yup.InferType<typeof accountSchema> & { id: number }

export type { Account }

