import { GET_PROJECTS_URL } from "../config/urls"
import { Project } from "../types"

export const fetchProjects = (socialId: string): Promise<Project[]> => {
  return fetch(GET_PROJECTS_URL(socialId)).then((response) => response.json())
}