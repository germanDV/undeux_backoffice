import client from './client'
import { Project } from 'lib/schemas'

export async function fetchProjects() {
  return client<{projects: Project[]}>({
    method: 'GET',
    url: '/api/projects',
  })
}

type CreateNotRequired = { id: number; finished: boolean }
export async function createProject(payload: Omit<Project, keyof CreateNotRequired>) {
  return client<{id: number}>({
    method: 'POST',
    url: '/api/projects',
    data: payload,
  })
}

type UpdateNotRequired = { name: string; notes: string }
export async function updateProject(payload: Omit<Project, keyof UpdateNotRequired>) {
  return client<{msg: string}>({
    method: 'PUT',
    url: '/api/projects',
    data: payload,
  })
}

