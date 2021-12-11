import { useProjects } from 'lib/hooks/project'
import ProjectListItem from './ProjectListItem'

const ProjectList = (): JSX.Element => {
  const { data, error, isError, isLoading } = useProjects()

  if (isLoading) {
    return <p>Cargando projectos...</p>
  }

  if (isError && error) {
    return (
      <div>
        <p>Algo no anda bien</p>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <>
      {(data?.projects || []).map((p) => (
        <ProjectListItem key={p.id} project={p} />
      ))}
    </>
  )
}

export default ProjectList

