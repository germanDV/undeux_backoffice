import { useEffect } from 'react'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import { useTheme } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
import Alert from '@mui/material/Alert'
import { Form, Separator } from 'ui/form.styles'
import { useFormik } from 'formik'
import { useFX, useUpdateFX } from 'lib/hooks/fx'
import { tr } from 'lib/helpers'
import { fxSchema, FXSubmission } from 'lib/schemas'

const FX = (): JSX.Element => {
  const mutation = useUpdateFX()
  const theme = useTheme()
  const fxData = useFX()

  const formik = useFormik({
    initialValues: { rate: 0 },
    validationSchema: fxSchema,
    onSubmit: (data: FXSubmission) => {
      mutation.mutate({ rate: +data.rate })
    },
  })

  useEffect(() => {
    if (fxData.isSuccess && !formik.touched.rate) {
      formik.setValues({ rate: fxData.data.fx.rate })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fxData.data?.fx.rate, fxData.isSuccess])

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  const renderRateInput = () => {
    if (fxData.isLoading) {
      return 'cargando...'
    }
    return (
      <TextField
        id="rate"
        name="rate"
        label="USD/ARS"
        value={formik.values.rate}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
    )
  }

  return (
    <Paper elevation={3} sx={{ textAlign: 'right', mb: theme.spacing(2) }}>
      <Form onSubmit={formik.handleSubmit}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems="center"
          justifyContent="flex-end"
          spacing={2}
          p={theme.spacing(2)}
        >
          {renderRateInput()}
          <LoadingButton
            type="submit"
            loading={formik.isSubmitting}
            variant="outlined"
            color="primary"
            sx={{ height: 56 }}
          >
            Actualizar
          </LoadingButton>
        </Stack>
      </Form>
      {mutation.isError && (
        <div>
          <Alert severity="error">
            {tr((mutation.error as Error).message)}
          </Alert>
          <Separator />
        </div>
      )}
    </Paper>
  )
}

export default FX
