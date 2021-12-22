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
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import esLocale from 'date-fns/locale/es'
import { collectionSchema, CollectionSubmission } from 'lib/schemas'
import { useMakeCollection } from 'lib/hooks/collection'
import { useCustomers } from 'lib/hooks/customer'
import { useActiveProjects } from 'lib/hooks/project'
import { Form, Separator } from 'ui/form.styles'
import { PaperContainer } from 'ui/paper.styles'
import { tr, nowUTC, dateToString } from 'lib/helpers'

const CollectionForm = (): JSX.Element => {
  const mutation = useMakeCollection()
  const { enqueueSnackbar } = useSnackbar()
  const { data: customersData } = useCustomers()
  const { data: projectsData } = useActiveProjects()

  const formik = useFormik({
    initialValues: {
      date: nowUTC(),
      amount: 0,
      description: '',
      accountId: 0,
      projectId: 0,
      customerId: 0,
    },
    validationSchema: collectionSchema,
    onSubmit: (data: CollectionSubmission) => {
      mutation.mutate({
        ...data,
        amount: Math.round(data.amount),
        date: dateToString(data.date as unknown as Date),
      })
    },
  })

  if (formik.isSubmitting && (mutation.isError || mutation.isSuccess)) {
    formik.setSubmitting(false)
  }

  const { resetForm } = formik
  useEffect(() => {
    if (mutation.isSuccess) {
      enqueueSnackbar('Cobro registrado exitosamente.', { variant: 'success' })
      resetForm()
    }
  }, [mutation.isSuccess, resetForm, enqueueSnackbar])

  return (
    <PaperContainer>
      <Typography variant="h6" align="center">
        Registrar Cobranza
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

        <LocalizationProvider dateAdapter={AdapterDateFns} locale={esLocale}>
          <DatePicker
            label="Fecha de cobro"
            value={formik.values.date}
            onChange={(date: Date | null) => formik.setFieldValue('date', date)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
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
          <InputLabel id="customer">Cliente</InputLabel>
          <Select
            labelId="customer"
            id="customerId"
            name="customerId"
            value={formik.values.customerId === 0 ? '' : formik.values.customerId}
            label="Cliente"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.customerId && !!formik.errors.customerId}
          >
            {customersData && customersData.customers?.length > 0
              ? customersData.customers.map((c) => <MenuItem value={c.id} key={c.id}>{c.name}</MenuItem>)
              : null}
          </Select>
          <FormHelperText className="Mui-error">
            {formik.touched.customerId && formik.errors.customerId}
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

export default CollectionForm

