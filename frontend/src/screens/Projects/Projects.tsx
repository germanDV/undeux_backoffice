import { useState, useCallback } from 'react'
import { useSnackbar } from 'notistack'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import PageTitle from 'components/PageTitle/PageTitle'
import ProjectList from 'components/ProjectList/ProjectList'
import NewProject from 'components/ProjectList/NewProject'

const Projects = (): JSX.Element => {
  const [open, setOpen] = useState(false) 
  const { enqueueSnackbar } = useSnackbar()

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  const handleSuccess = useCallback((id: number) => {
    setOpen(false)
    enqueueSnackbar(`Proyecto ${id} creado exitosamente`, {
      variant: 'success',
    })
  }, [setOpen, enqueueSnackbar])

  return (
    <div>
      <PageTitle>proyectos</PageTitle>
      <ProjectList />
      <Box sx={{ my: 8, display: 'flex', justifyContent: 'right' }}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpen(true)}
          variant="extended"
        >
          <AddIcon sx={{ mr: 1 }} />
          Crear Proyecto
        </Fab>
      </Box>
      <NewProject
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
      />
    </div>
  )
}

export default Projects

