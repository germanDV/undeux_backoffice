import Typography from '@mui/material/Typography'
import { PaperContainer } from 'ui/paper.styles'
import { formatAmount } from 'lib/helpers'

interface Props {
  active: boolean
  payload: any
  label: string
  category: 'payment' | 'collection'
}

const PaymentTooltip = ({ active, payload, label, category }: Props): JSX.Element | null => {
  if (!active || !payload || payload.length < 1) return null

  return (
    <PaperContainer>
      <Typography variant="caption">
        Fecha: {label}
      </Typography>
      <br />
      <Typography variant="caption">
        Importe: {formatAmount(payload[0].value)}
      </Typography>
      <br />
      <Typography variant="caption">
        Proyecto: {payload[0].payload.project}
      </Typography>
      <br />
      <Typography variant="caption">
        {category === 'payment'
          ? `Proveedor: ${payload[0].payload.vendor}`
          : `Cliente: ${payload[0].payload.customer}`
        }
      </Typography>
    </PaperContainer>
  )
}

export default PaymentTooltip

