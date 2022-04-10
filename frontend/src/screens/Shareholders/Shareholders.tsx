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
import { PaperContainer } from 'ui/paper.styles'

const Shareholders = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleSuccess = useCallback((id: number) => {
    setOpen(false)
    enqueueSnackbar(`Socio ${id} creado exitosamente.`, {
      variant: 'success',
    })
  }, [setOpen, enqueueSnackbar])

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
          onClick={() => setOpen(true)}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Socio
        </Fab>
      </Box>
      <NewShareholder
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </div>
  )
}

export default Shareholders

