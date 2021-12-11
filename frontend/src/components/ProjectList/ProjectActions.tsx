import { useSnackbar } from 'notistack'
import Tooltip from '@mui/material/Tooltip'
import LoadingButton from '@mui/lab/LoadingButton'
import { useUpdateProject } from 'lib/hooks/project'

interface Props {
  projectId: number
  finished: boolean | undefined
}

const ProjectActions = ({ projectId, finished }: Props): JSX.Element => {
  const mutation = useUpdateProject()
  const { enqueueSnackbar } = useSnackbar()
  const tooltip = finished ? 'Marcar como "En Progreso"' : 'Marchar como "Terminado"'

  const handleUpdate = () => {
    mutation.mutate({ id: projectId, finished: !finished })
  }

  if (mutation.isError) {
    enqueueSnackbar(`Error actualizando proyecto ${projectId}`, {
      variant: 'error',
    })
  }

  return (
    <Tooltip title={tooltip} arrow>
      <LoadingButton
        type="submit"
        loading={mutation.isLoading}
        loadingPosition="end"
        variant="outlined"
        color="primary"
        onClick={handleUpdate}
      >
        {finished ? 'En Progreso' : 'Terminado'}
      </LoadingButton>
    </Tooltip>
  )
}

export default ProjectActions

