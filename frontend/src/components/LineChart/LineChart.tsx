import {
  LineChart as Chart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { PaperContainer } from 'ui/paper.styles'
import PaymentTooltip from './PaymentTooltip'

interface Props {
  data: any[]
  x: string
  y: string
  color: string
  legend: string
}

const LineChart = ({ data, x, y, color, legend }: Props): JSX.Element => {
  return (
    <PaperContainer>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <Chart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x} />
            <YAxis />
            {/* @ts-ignore */}
            <Tooltip content={<PaymentTooltip />} />
            <Legend />
            <Line
              name={legend}
              type="monotone"
              dataKey={y}
              stroke={color}
            />
          </Chart>
        </ResponsiveContainer>
      </div>
    </PaperContainer>
  )
}

export default LineChart

