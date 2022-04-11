import { useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Project } from '../schemas'
import { fetchProjects, createProject, updateProject } from 'api'

const QUERY_KEY = 'projects'

function filterActive(projects: Project[]): Project[] {
  return projects.filter(p => !p.finished)
}

export function useProjects() {
  return useQuery<{projects: Project[]}, Error>(QUERY_KEY, fetchProjects)
}

export function useActiveProjects() {
  return useQuery<{projects: Project[]}>(QUERY_KEY, fetchProjects, {
    select: (data) => ({ projects: filterActive(data.projects) }),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation(createProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation(updateProject, {
    onSuccess: () => {
      queryClient.invalidateQueries(QUERY_KEY)
    },
  })
}

export function useGetProjectName() {
  const projectsData = useProjects()

  return useCallback((id: number): string => {
    if (!projectsData.data?.projects) return ''
    const project = projectsData.data.projects.find(p => p.id === id)
    return project ? project.name : ''
  }, [projectsData.data?.projects])
}
