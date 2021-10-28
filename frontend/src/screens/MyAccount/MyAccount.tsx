import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { useSnackbar } from 'notistack'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import SaveIcon from '@mui/icons-material/Save'
import Alert from '@mui/material/Alert'
import { myPasswordValidationSchema, MyPasswordValues } from 'lib/schemas'
import { useChangeMyPassword } from 'lib/hooks/user'
import { translateErr } from 'lib/helpers'
import { Container, FormWrapper, Form, Separator } from 'ui/form.styles'

const MyAccount = (): JSX.Element => {
  const { enqueueSnackbar } = useSnackbar()
  const mutation = useChangeMyPassword()

  const formik = useFormik({
    initialValues: { oldPassword: '', newPassword: '', newPasswordConfirmation: '' },
    validationSchema: myPasswordValidationSchema,
    onSubmit: ({ oldPassword, newPassword }: MyPasswordValues) => {
      mutation.mutate({ oldPassword, newPassword })
    },
  });

  useEffect(() => {
    if (mutation.isSuccess) {
      enqueueSnackbar('Password actualizada exitosamente.', {
        variant: 'success',
      })
      formik.resetForm()
    }
  }, [mutation.isSuccess])

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  return (
    <Container>
      <FormWrapper elevation={3}>
        <Form onSubmit={formik.handleSubmit}>
          <Typography variant="h4" align="center">
            Cambiar Password
          </Typography>
          <Separator times={2} />

          <TextField
            id="oldPassword"
            name="oldPassword"
            label="Password actual"
            type="password"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.oldPassword && !!formik.errors.oldPassword}
            helperText={formik.touched.oldPassword && formik.errors.oldPassword}
          />
          <Separator />

          <TextField
            id="newPassword"
            name="newPassword"
            label="Nueva password"
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && !!formik.errors.newPassword}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />
          <Separator />

          <TextField
            id="newPasswordConfirmation"
            name="newPasswordConfirmation"
            label="Confirmación de nueva password"
            type="password"
            value={formik.values.newPasswordConfirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPasswordConfirmation && !!formik.errors.newPasswordConfirmation}
            helperText={formik.touched.newPasswordConfirmation && formik.errors.newPasswordConfirmation}
          />
          <Separator times={2} />

          <LoadingButton
            type="submit"
            endIcon={<SaveIcon />}
            loading={formik.isSubmitting}
            loadingPosition="end"
            variant="contained"
            color="primary"
            sx={{ height: 56 }}
          >
            Cambiar
          </LoadingButton>
          <Separator />

          {mutation.isError && (
            <div>
              <Alert severity="error">{translateErr(mutation.error as Error)}</Alert>
              <Separator />
            </div>
          )}
        </Form>
      </FormWrapper>
    </Container>
  )
}

export default MyAccount
