import { useEffect } from 'react'
import { useFormik } from 'formik'
import { useSnackbar } from 'notistack'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Select from '@mui/material/Select'
import { paymentSchema, PaymentSubmission } from 'lib/schemas'
import { useMakePayment } from 'lib/hooks/payment'
import { useVendors } from 'lib/hooks/vendor'
import { useActiveProjects } from 'lib/hooks/project'
import { Form, Separator } from 'ui/form.styles'
import { PaperContainer } from 'ui/paper.styles'
import { tr, nowUTC } from 'lib/helpers'

const PaymentForm = (): JSX.Element => {
  const mutation = useMakePayment()
  const { enqueueSnackbar } = useSnackbar()
  const { data: vendorsData } = useVendors()
  const { data: projectsData } = useActiveProjects()

  const formik = useFormik({
    initialValues: {
      date: nowUTC(),
      amount: 0,
      description: '',
      accountId: 0,
      projectId: 0,
      vendorId: 0,
    },
    validationSchema: paymentSchema,
    onSubmit: (data: PaymentSubmission) => {
      mutation.mutate({ ...data, amount: Math.round(data.amount) })
    },
  })

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  const { resetForm } = formik
  useEffect(() => {
    if (mutation.isSuccess) {
      enqueueSnackbar('Pago registrado exitosamente.', { variant: 'success' })
      resetForm()
    }
  }, [mutation.isSuccess, resetForm, enqueueSnackbar])

  return (
    <PaperContainer>
      <Typography variant="h6" align="center">
        Registrar Pago
      </Typography>
      <Form onSubmit={formik.handleSubmit}>
        <Separator />
        <TextField
          id="amount"
          name="amount"
          label="Importe (sin decimales)"
          value={formik.values.amount === 0 ? '' : formik.values.amount}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.amount && !!formik.errors.amount}
          helperText={formik.touched.amount && formik.errors.amount}
        />
        <Separator />

        <FormControl fullWidth>
          <InputLabel id="account">Cuenta</InputLabel>
          <Select
            labelId="account"
            id="accountId"
            name="accountId"
            value={formik.values.accountId === 0 ? '' : formik.values.accountId}
            label="Cuenta"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.accountId && !!formik.errors.accountId}
          >
            <MenuItem value={1}>ARS</MenuItem>
            <MenuItem value={2}>USD</MenuItem>
          </Select>
          <FormHelperText className="Mui-error">
            {formik.touched.accountId && formik.errors.accountId}
          </FormHelperText>
        </FormControl>
        <Separator />

        <FormControl fullWidth>
          <InputLabel id="vendor">Proveedor</InputLabel>
          <Select
            labelId="vendor"
            id="vendorId"
            name="vendorId"
            value={formik.values.vendorId === 0 ? '' : formik.values.vendorId}
            label="Proveedor"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.vendorId && !!formik.errors.vendorId}
          >
            {vendorsData && vendorsData.vendors?.length > 0
              ? vendorsData.vendors.map((v) => <MenuItem value={v.id} key={v.id}>{v.name}</MenuItem>)
              : null}
          </Select>
          <FormHelperText className="Mui-error">
            {formik.touched.vendorId && formik.errors.vendorId}
          </FormHelperText>
        </FormControl>
        <Separator />

        <FormControl fullWidth>
          <InputLabel id="project">Proyecto</InputLabel>
          <Select
            labelId="project"
            id="projectId"
            name="projectId"
            value={formik.values.projectId === 0 ? '' : formik.values.projectId}
            label="Proyecto"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.projectId && !!formik.errors.projectId}
          >
            {projectsData && projectsData.projects?.length > 0
              ? projectsData.projects.filter(p => !p.finished).map(p => (
                <MenuItem value={p.id} key={p.id}>{p.name}</MenuItem>
              ))
              : null}
          </Select>
          <FormHelperText className="Mui-error">
            {formik.touched.projectId && formik.errors.projectId}
          </FormHelperText>
        </FormControl>
        <Separator />

        <TextField
          id="description"
          name="description"
          label="Descripción"
          multiline
          minRows={3}
          maxRows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && !!formik.errors.description}
          helperText={formik.touched.description && formik.errors.description}
        />
        <Separator />

        <LoadingButton
          type="submit"
          loading={formik.isSubmitting}
          variant="outlined"
          color="primary"
          sx={{ height: 56 }}
        >
          Registrar
        </LoadingButton>
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
    </PaperContainer>
  )
}

export default PaymentForm

