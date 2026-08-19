import { GET_PROJECTS_URL, UPLOAD_SQL_URL } from "../config/urls"
import { Project, UserChoice, UserVotes } from "../types"

type SubmittedVote = {
  projectId: number
  choice: UserChoice
}

const VOTE_COLUMNS: Record<UserChoice, [number, number, number]> = {
  [UserChoice.YES]: [1, 0, 0],
  [UserChoice.NO]: [0, 1, 0],
  [UserChoice.ABSTAIN]: [0, 0, 1],
}

export class ProjectNotFoundError extends Error {
  constructor() {
    super('Project not found')
    this.name = 'ProjectNotFoundError'
  }
}

export const fetchProjects = async (councilSocialId: string): Promise<Project[]> => {
  const response = await fetch(GET_PROJECTS_URL(councilSocialId))

  if (!response.ok) {
    if (response.status === 404) {
      throw new ProjectNotFoundError()
    }

    throw new Error('Failed to fetch projects')
  }

  const projects = await response.json()

  if (!Array.isArray(projects) || projects.length === 0) {
    throw new ProjectNotFoundError()
  }

  return projects
}

export const sendProjectVotes = async (
  councilSocialId: string,
  userId: string,
  userVotes: UserVotes,
): Promise<void> => {
  const votes = getSubmittedVotes(userVotes)
  if (votes.length === 0) return

  const sqlFile = new File(
    [buildVotesSql(councilSocialId, userId, votes)],
    'P_Online.sql',
    { type: 'application/sql' },
  )

  const formData = new FormData()
  formData.append('arquivoSQL', sqlFile)

  const response = await fetch(UPLOAD_SQL_URL, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to send project votes')
  }
}

const getSubmittedVotes = (userVotes: UserVotes): SubmittedVote[] => {
  return Object.entries(userVotes).flatMap(([projectId, choice]) => {
    if (choice == null) return []

    return [{ projectId: Number(projectId), choice }]
  })
}

const buildVotesSql = (councilSocialId: string, userId: string, votes: SubmittedVote[]): string => {
  const projectIds = votes.map((vote) => vote.projectId).join(', ')
  const values = votes
    .map((vote) => {
      const [inFavor, against, undecided] = VOTE_COLUMNS[vote.choice]
      return `(${vote.projectId}, '${userId}', ${inFavor},${against},${undecided})`
    })
    .join(', ')

  return [
    councilSocialId,
    `DELETE FROM tblVotoPopularTMP Where idProjeto IN (${projectIds}) AND Endereco_IP = '${userId}';`,
    `Insert Into tblVotoPopularTMP (idProjeto, Endereco_IP, Voto_Favor, Voto_Contra, Voto_Indeciso) VALUES ${values};`,
  ].join('\n')
}
