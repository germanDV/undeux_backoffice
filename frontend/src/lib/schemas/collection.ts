import * as yup from 'yup'

export const collectionSchema = yup.object({
  date: yup
    .string()
    .required('Ingresá fecha del pago.'),
  amount: yup
    .number()
    .required('Ingesá el importe del pago.')
    .moreThan(0, 'Debe ser un número mayor a 0.'),
  description: yup
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(500, 'Máximo 500 caracteres.')
    .required('Ingresá una descripción.'),
  accountId: yup
    .number()
    .min(1, 'Número de cuenta debe ser positivo')
    .required('Ingresá la cuenta de la que salen los fondos.'),
  projectId: yup
    .number()
    .min(1, 'Número de cuenta debe ser positivo')
    .required('Ingresá el proyecto al que se relaciona el pago.'),
  customerId: yup
    .number()
    .min(1, 'Número de cuenta debe ser positivo')
    .required('Ingresá el cliente que hizo pago.'),
})

type CollectionSubmission = yup.InferType<typeof collectionSchema>
type Collection = CollectionSubmission & { id: number }

export type { Collection, CollectionSubmission }

