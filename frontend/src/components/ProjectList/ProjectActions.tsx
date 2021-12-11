import { useSnackbar } from 'notistack'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { useUpdateProject } from 'lib/hooks/project'

interface Props {
  projectId: number
  finished: boolean | undefined
}

const ProjectActions = ({ projectId, finished }: Props): JSX.Element => {
  const mutation = useUpdateProject()
  const { enqueueSnackbar } = useSnackbar()

  const handleUpdate = () => {
    mutation.mutate({ id: projectId, finished: !finished })
  }

  if (mutation.isError) {
    enqueueSnackbar(`Error actualizando proyecto ${projectId}`, {
      variant: 'error',
    })
  }

  return (
    <FormControlLabel
      control={<Switch color="secondary" checked={finished} onChange={handleUpdate} />}
      label="Terminado"
    />
  )
}

export default ProjectActions

