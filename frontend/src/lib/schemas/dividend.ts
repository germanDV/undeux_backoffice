import * as yup from 'yup'

export const dividendSchema = yup.object({
  date: yup
    .string()
    .required('Ingresá fecha del dividendo.'),
  amount: yup
    .number()
    .required('Ingesá el importe del dividendo.')
    .moreThan(0, 'Debe ser un número mayor a 0.'),
  accountId: yup
    .number()
    .min(1, 'Número de cuenta debe ser positivo')
    .required('Ingresá la cuenta de la que salen los fondos.'),
  shareholderId: yup
    .number()
    .min(1, 'ID de socio debe ser positivo')
    .required('Ingresá el socio que recibe el dividendo.'),
})

type DividendSubmission = yup.InferType<typeof dividendSchema>
type Dividend = DividendSubmission & { id: number }

export type { Dividend, DividendSubmission }
