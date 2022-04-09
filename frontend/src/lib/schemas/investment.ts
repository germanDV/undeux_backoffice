import * as yup from 'yup'

export const investmentSchema = yup.object({
  date: yup
    .string()
    .required('Ingresá fecha del pago.'),
  amount: yup
    .number()
    .required('Ingesá el importe del pago.')
    .moreThan(0, 'Debe ser un número mayor a 0.'),
  accountId: yup
    .number()
    .min(1, 'Número de cuenta debe ser positivo')
    .required('Ingresá la cuenta de la que salen los fondos.'),
  shareholderId: yup
    .number()
    .min(1, 'ID de socio debe ser positivo')
    .required('Ingresá el socio que hizo la inversión.'),
})

type InvestmentSumbission = yup.InferType<typeof investmentSchema>
type Investment = InvestmentSumbission & { id: number }

export type { Investment, InvestmentSumbission }
