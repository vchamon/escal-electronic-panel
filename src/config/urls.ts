const ESCAL_API_URL = 'https://www.escaltecnologia.com.br/TrocaDadosComPainel/api/v1'
const PROJECTS_URL = `${ESCAL_API_URL}/projeto`

export const GET_PROJECTS_URL = (socialId: string) => `${PROJECTS_URL}/${socialId}`
export const GET_PROJECT_BY_ID_URL = (socialId: string, projectId: string) => `${GET_PROJECTS_URL(socialId)}/${projectId}`
