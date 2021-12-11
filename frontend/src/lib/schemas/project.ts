import * as yup from 'yup'

export const projectSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Mínimo 2 caracteres.')
    .max(100, 'Máximo 100 caracteres.')
    .required('Ingresá un nombre para el proyecto.'),
  notes: yup
    .string()
    .max(500, 'Máximo 500 caracteres.'),
  finished: yup
    .bool(),
})

type Project = yup.InferType<typeof projectSchema> & { id: number }

export type { Project }

