import { FC, useState, useEffect, useCallback } from 'react'
import { useInvestments } from 'lib/hooks/investment'
import { useDividends } from 'lib/hooks/dividend'
import { useGetAccountName } from 'lib/hooks/account'
import { useFX } from 'lib/hooks/fx'
import { useGetShareholderName } from 'lib/hooks/shareholder'
import SimplePie, { Datapoint } from '../PieChart/SimplePie'

type Summation = Record<number, Record<string, number>>

const EquityChart: FC = () => {
  const [data, setData] = useState<Datapoint[]>([])
  const investmentsData = useInvestments()
  const dividendsData = useDividends()
  const fxData = useFX()
  const getAccount = useGetAccountName()
  const getShareholderName = useGetShareholderName()

  const toUSD = useCallback((ars: number) => {
    if (fxData.isSuccess) {
      const { rate } = fxData.data.fx
      return Math.round(ars / rate);
    } else {
      return ars
    }
  }, [fxData.isSuccess, fxData.data?.fx])

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
          total: usd + toUSD(ars),
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
    toUSD,
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

  return <SimplePie data={data} />
}

export default EquityChart
