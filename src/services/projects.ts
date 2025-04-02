import { GET_PROJECTS_URL } from "../config/urls"
import { Project } from "../types"

export const fetchProjects = async (councilSocialId: string): Promise<Project[]> => {
  return fetch(GET_PROJECTS_URL(councilSocialId)).then((response) => response.json())
}
