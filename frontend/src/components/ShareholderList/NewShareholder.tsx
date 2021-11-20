import React, { useEffect } from 'react'
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
import { shareholderSchema, Shareholder } from 'lib/schemas'
import { useCreateShareholder } from 'lib/hooks/shareholder'
import { tr } from 'lib/helpers'
import { Form, Separator } from 'ui/form.styles'

interface Props {
  open: boolean
  handleClose: () => void
  handleSuccess: (id: number) => void
}

const NewShareholder = ({ open, handleClose, handleSuccess }: Props): JSX.Element => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const mutation = useCreateShareholder()

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: shareholderSchema,
    onSubmit: ({ name }: Omit<Shareholder, 'id'>) => {
      mutation.mutate({ name })
    },
  });

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
      <DialogTitle>Crear Socio</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Creación de nuevo socio / accionista.
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

export default NewShareholder

