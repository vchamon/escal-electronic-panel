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

export const fetchProjects = async (councilSocialId: string): Promise<Project[]> => {
  return fetch(GET_PROJECTS_URL(councilSocialId)).then((response) => response.json())
}

export const sendProjectVotes = async (
  councilSocialId: string,
  userIp: string,
  userVotes: UserVotes,
): Promise<void> => {
  const votes = getSubmittedVotes(userVotes)
  if (votes.length === 0) return

  const sqlFile = new File(
    [buildVotesSql(councilSocialId, userIp, votes)],
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

const buildVotesSql = (councilSocialId: string, userIp: string, votes: SubmittedVote[]): string => {
  const projectIds = votes.map((vote) => vote.projectId).join(', ')
  const values = votes
    .map((vote) => {
      const [inFavor, against, undecided] = VOTE_COLUMNS[vote.choice]
      return `(${vote.projectId}, '${userIp}', ${inFavor},${against},${undecided})`
    })
    .join(', ')

  return [
    councilSocialId,
    `DELETE FROM tblVotoPopularTMP Where idProjeto IN (${projectIds}) AND Endereco_IP = '${userIp}';`,
    `Insert Into tblVotoPopularTMP (idProjeto, Endereco_IP, Voto_Favor, Voto_Contra, Voto_Indeciso) VALUES ${values};`,
  ].join('\n')
}
