export type Project = {
  idProjeto: number,
  autor: string,
  ementa: string
  turno: string | null
  tipo_Proposicao: string | null
  numero_Projeto: string
  data_Projeto: Date
  nome_Camara: string
  cnpj_Camara: string
}

export enum UserChoice {
  YES = 'YES',
  NO = 'NO',
  ABSTAIN = 'ABSTAIN'
}

export type UserVote = Record<string, UserChoice | null>

export type Result = {
  userIp?: string
  userVote: UserVote
}