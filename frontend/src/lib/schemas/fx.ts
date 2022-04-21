import * as yup from 'yup'

export const fxSchema = yup.object({
  rate: yup
    .number()
    .moreThan(0, 'Tipo de cambio debe ser positivo.')
    .required('Ingresá el tip de cambio')
})

type FXSubmission = yup.InferType<typeof fxSchema>
type FX = FXSubmission & { currency: 'ARS', updatedAt: string }

export type { FX, FXSubmission }
