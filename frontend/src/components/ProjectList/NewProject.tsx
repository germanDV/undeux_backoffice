import { useEffect } from 'react'
import { useFormik } from 'formik'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Alert from '@mui/material/Alert'
import { projectSchema, Project } from 'lib/schemas'
import { useCreateProject } from 'lib/hooks/project'
import { tr } from 'lib/helpers'
import { Form, Separator } from 'ui/form.styles'

interface Props {
  open: boolean
  handleClose: () => void
  handleSuccess: (id: number) => void
}

const NewProject = ({ open, handleClose, handleSuccess }: Props): JSX.Element => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const mutation = useCreateProject()

  const formik = useFormik({
    initialValues: { name: '', notes: '', finished: false },
    validationSchema: projectSchema,
    onSubmit: ({ name, notes }: Omit<Project, 'id'>) => {
      mutation.mutate({ name, notes })
    },
  })

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  const newId = mutation.data?.id || 0
  const { resetForm } = formik
  useEffect(() => {
    if (mutation.isSuccess) {
      handleSuccess(newId)
    }
    return () => resetForm()
  }, [mutation.isSuccess, newId, handleSuccess, resetForm])

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>Crear Proyecto</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Creación de nuevo proyecto para asignación de ingresos y egresos
        </DialogContentText>
        <Form onSubmit={formik.handleSubmit}>
          <Separator />
          <TextField
            id="name"
            name="name"
            label="Nombre"
            autoFocus
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          <Separator />

          <TextField
            id="notes"
            name="notes"
            label="Notas"
            multiline
            minRows={10}
            maxRows={10}
            value={formik.values.notes}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.notes && !!formik.errors.notes}
            helperText={formik.touched.notes && formik.errors.notes}
          />
          <Separator times={2} />

          {mutation.isError && (
            <div>
              <Alert severity="error">
                {tr((mutation.error as Error).message)}
              </Alert>
              <Separator />
            </div>
          )}
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={formik.submitForm}>Crear</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewProject

