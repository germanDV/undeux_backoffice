import Skeleton from '@mui/material/Skeleton'
import { PaperContainer } from 'ui/paper.styles'

const TxTable = (): JSX.Element => {
  return (
    <PaperContainer>
      <Skeleton variant="text" height={50} animation={false} />
      <Skeleton variant="rectangular" height={500} animation={false} />
    </PaperContainer>
  )
}

export default TxTable

