import { useEffect } from 'react'
import { useFormik } from 'formik'
import esLocale from "date-fns/locale/es";
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from "@mui/material/Button"
import Alert from "@mui/material/Alert"
import TextField from "@mui/material/TextField";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DatePicker from "@mui/lab/DatePicker";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import { investmentSchema, InvestmentSumbission } from 'lib/schemas'
import { useMakeInvestment } from 'lib/hooks/investment'
import { useShareholders } from 'lib/hooks/shareholder'
import { nowUTC, dateToString, tr } from 'lib/helpers'
import { Form, Separator } from 'ui/form.styles'

interface Props {
  open: boolean
  handleClose: () => void
  handleSuccess: (msg: string) => void
}

const NewInvestment = ({ open, handleClose, handleSuccess }: Props): JSX.Element => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const mutation = useMakeInvestment()
  const shareholdersData = useShareholders()

  const formik = useFormik({
    initialValues: {
      date: nowUTC(),
      amount: 0,
      accountId: 0,
      shareholderId: 0,
    },
    validationSchema: investmentSchema,
    onSubmit: (data: InvestmentSumbission) => {
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

  const msg = mutation.data?.msg || ''
  const { resetForm } = formik
  useEffect(() => {
      if (mutation.isSuccess) {
        handleSuccess(msg)
        resetForm()
    }
  }, [mutation.isSuccess, resetForm, msg, handleSuccess])

  return (
    <Dialog open={open} onClose={handleClose} fullScreen={fullScreen}>
      <DialogTitle>Inversión</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Registrar inversión.
        </DialogContentText>
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
              label="Fecha de pago"
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
            <InputLabel id="shareholder">Socio</InputLabel>
            <Select
              labelId="shareholder"
              id="shareholderId"
              name="shareholderId"
              value={formik.values.shareholderId === 0 ? '' : formik.values.shareholderId}
              label="Socio"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.shareholderId && !!formik.errors.shareholderId}
            >
              {shareholdersData.data?.shareholders?.length
                ? shareholdersData.data.shareholders.map((s) => <MenuItem value={s.id} key={s.id}>{s.name}</MenuItem>)
                : null}
            </Select>
            <FormHelperText className="Mui-error">
              {formik.touched.shareholderId && formik.errors.shareholderId}
            </FormHelperText>
          </FormControl>
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
        <Button onClick={formik.submitForm}>Registrar</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewInvestment
