import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Project } from '../schemas'
import { fetchProjects, createProject, updateProject } from 'api'

function filterActive(projects: Project[]): Project[] {
  return projects.filter(p => !p.finished)
}

export function useProjects() {
  return useQuery<{projects: Project[]}, Error>('projects', fetchProjects)
}

export function useActiveProjects() {
  return useQuery<{projects: Project[]}>('projects', fetchProjects, {
    select: (data) => ({ projects: filterActive(data.projects) }),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation(createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation(updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries('projects')
    },
  })
}

