import { useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import Grid from '@mui/material/Grid'
import ShareholderList from 'components/ShareholderList/ShareholderList'
import NewShareholder from 'components/ShareholderList/NewShareholder'
import PageTitle from 'components/PageTitle/PageTitle'
import EquityTable from 'components/Equity/EquityTable'
import EquityChart from 'components/Equity/EquityChart'
import NewDividend from 'components/Equity/NewDividend'
import { PaperContainer } from 'ui/paper.styles'

const Shareholders = (): JSX.Element => {
  const [shareholderOpen, setShareholderOpen] = useState(false);
  const [dividendOpen, setDividendOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar()

  const handleShareholderClose = useCallback(() => {
    setShareholderOpen(false)
  }, [setShareholderOpen])

  const handleShareholderSuccess = useCallback((id: number) => {
    setShareholderOpen(false)
    enqueueSnackbar(`Socio ${id} creado exitosamente.`, {
      variant: 'success',
    })
  }, [setShareholderOpen, enqueueSnackbar])

  const handleDividendClose = useCallback(() => {
    setDividendOpen(false)
  }, [setDividendOpen])

  const handleDividendSuccess = useCallback((msg: string) => {
    setDividendOpen(false)
    enqueueSnackbar(msg, { variant: 'success' })
  }, [setDividendOpen, enqueueSnackbar])

  return (
    <div>
      <PageTitle>Inversiones y Dividendos</PageTitle>

      <PaperContainer>
          <Grid container spacing={2}>
            <Grid item md={12} lg={8} height={500}>
              <EquityTable />
            </Grid>
            <Grid item md={12} lg={4} height={500}>
              <EquityChart />
            </Grid>
          </Grid>
      </PaperContainer>

      <ShareholderList />

      <Box sx={{ my: 8, display: 'flex', justifyContent: 'right' }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setDividendOpen(true)}
          variant="extended"
          sx={{ mr: 1 }}
        >
          <AddIcon sx={{ mr: 1 }} />
          Registrar Dividendo
        </Fab>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setShareholderOpen(true)}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Socio
        </Fab>
      </Box>

      <NewDividend
        open={dividendOpen}
        handleClose={handleDividendClose}
        handleSuccess={handleDividendSuccess}
      />
      <NewShareholder
        open={shareholderOpen}
        handleClose={handleShareholderClose}
        handleSuccess={handleShareholderSuccess}
      />
    </div>
  )
}

export default Shareholders

