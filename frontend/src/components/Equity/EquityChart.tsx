import { FC, useState, useEffect, useCallback } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useTheme } from '@mui/material/styles'
import { useInvestments } from 'lib/hooks/investment'
import { useDividends } from 'lib/hooks/dividend'
import { useAccounts } from 'lib/hooks/account'
import { useShareholders } from 'lib/hooks/shareholder'
import { toUSD } from 'lib/helpers'

type Datapoint = {
  name: string
  ars: number
  usd: number
  total: number
}

type Summation = Record<number, Record<string, number>>


type LabelDef = {
  cx: string
  cy: string
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: LabelDef) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const EquityChart: FC = () => {
  const [data, setData] = useState<Datapoint[]>([])
  const investmentsData = useInvestments()
  const dividendsData = useDividends()
  const acctData = useAccounts()
  const shareholdersData = useShareholders()
  const theme = useTheme()
  const [colors] = useState(() => [theme.palette.primary.main, theme.palette.secondary.main])

  const getShareholderName = useCallback((id:number): string => {
    if (!shareholdersData.data?.shareholders) return ''
    const sh = shareholdersData.data.shareholders.find(s => s.id === id)
    return sh ? sh.name : ''
  }, [shareholdersData.data?.shareholders])

  const getAccount = useCallback((id: number): string => {
    if (!acctData.data?.accounts) return ''
    const acct = acctData.data.accounts.find(a => a.id === id)
    return acct ? acct.currency : ''
  }, [acctData.data?.accounts])

  useEffect(() => {
    if (investmentsData.isSuccess && dividendsData.isSuccess) {
      const datapoints: Datapoint[] = []
      let summation: Summation = {}

      if (investmentsData.data?.investments) {
        investmentsData.data?.investments.forEach(i => {
          const curr = getAccount(i.accountId).toLowerCase()
          if (!summation[i.shareholderId]) {
            summation[i.shareholderId] = {
              [curr]: i.amount,
            }
          } else {
            const prev = summation[i.shareholderId][curr] || 0
            summation[i.shareholderId][curr] = i.amount + prev
          }
        })
      }

      if (dividendsData.data?.dividends) {
        dividendsData.data?.dividends.forEach(i => {
          const curr = getAccount(i.accountId).toLowerCase()
          if (!summation[i.shareholderId]) {
            summation[i.shareholderId] = {
              [curr]: -i.amount,
            }
          } else {
            const prev = summation[i.shareholderId][curr] || 0
            summation[i.shareholderId][curr] = prev - i.amount
          }
        })
      }

      Object.keys(summation).forEach(k => {
        const ars = summation[+k]['ars']
        const usd = summation[+k]['usd']
        datapoints.push({
          name: getShareholderName(+k),
          ars,
          usd,
          total:usd + toUSD(ars),
        })
      })

      setData(datapoints)
    }
  }, [
    investmentsData.data?.investments,
    investmentsData.isSuccess,
    dividendsData.data?.dividends,
    dividendsData.isSuccess,
    getShareholderName,
    getAccount,
  ])

  if (investmentsData.isLoading || dividendsData.isLoading) {
    return <p>Cargando inversiones y dividendos...</p>
  }

  if (investmentsData.isError || dividendsData.isError) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{investmentsData.error?.message}</p>
        <p>{dividendsData.error?.message}</p>
      </div>
    )
  }

  if (!investmentsData.data?.investments && !dividendsData.data?.dividends) {
    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={500} height={500}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="black"
          dataKey="total"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default EquityChart
