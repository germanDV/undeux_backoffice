import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Project } from '../schemas'
import { fetchProjects, createProject, updateProject } from 'api'

export function useProjects() {
  return useQuery<{projects: Project[]}, Error>('projects', fetchProjects)
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

