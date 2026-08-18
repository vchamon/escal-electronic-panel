const ESCAL_API_URL = 'https://www.escaltecnologia.com.br/TrocaDadosComPainel/api/'
const PROJECTS_URL = `${ESCAL_API_URL}/v1/projeto`
export const UPLOAD_SQL_URL = `${ESCAL_API_URL}/upload/sql/unico`


export const GET_USER_IP_URL = 'https://api.ipify.org/?format=json'
export const GET_PROJECTS_URL = (socialId: string) => `${PROJECTS_URL}/${socialId}`
export const GET_PROJECT_BY_ID_URL = (socialId: string, projectId: string) => `${GET_PROJECTS_URL(socialId)}/${projectId}`
