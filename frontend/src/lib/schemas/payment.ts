import * as yup from 'yup'

export const paymentSchema = yup.object({
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
  vendorId: yup
    .number()
    .min(1, 'Número de cuenta debe ser positivo')
    .required('Ingresá el beneficiario del pago.'),
})

type PaymentSubmission = yup.InferType<typeof paymentSchema>
type Payment = PaymentSubmission & { id: number }

export type { Payment, PaymentSubmission }

