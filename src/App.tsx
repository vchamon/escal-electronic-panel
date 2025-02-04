import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'

import { fetchProjects } from './services/projects'
import { useLocation } from 'react-router-dom'
import { Project, Result, UserChoice, UserVote } from './types'
import { getUserIp } from './services/user-ip'

const UserChoiceLabels = {
  [UserChoice.YES]: 'A favor',
  [UserChoice.ABSTAIN]: 'Indeciso',
  [UserChoice.NO]: 'Contra',
}

const App = () => {
  const [userIp, setUserIp] = useState<string>()
  const [projects, setProjects] = useState<Project[]>([])
  const [userVote, setUserVote] = useState<UserVote>({})
  const [result, setResult] = useState<Result>()

  const { pathname } = useLocation()

  useEffect(() => {
    getUserIp().then(setUserIp)

    const socialId = pathname.split('/').pop() as string
    fetchProjects(socialId).then(setProjects)
  }, [])

  const handleChangeUserVote = useCallback((projectId: number, userChoice: UserChoice) => {
    const id = projectId.toString()

    setUserVote({
      ...userVote,
      [id]: userVote[id] === userChoice ? null : userChoice
    })
  }, [userVote])

  const isSubmitDisabled = useMemo(() => Object.values(userVote).every((value) => value === null), [userVote])

  const renderProjects = useMemo(() => {
    return projects?.map((project) => {
      return (
        <div className='flex flex-col gap-4 border border-gray-200 rounded-lg px-6 py-4 text-sm w-1/2 max-lg:w-full max-xl:w-2/3'>
          <div className='flex flex-col gap-2 w-full'>
            <span className='font-bold'>
              {`${project.tipo_Proposicao} nº ${project.numero_Projeto} de ${format(project.data_Projeto, 'dd/MM/yyyy')}`}
            </span>
            <span>{project.ementa}</span>
            <div className='flex justify-end'>
              <span className='font-semibold'>{project.autor}</span>
            </div>
          </div>
          <div className='w-full border-t'></div>
          <div className='flex justify-evenly'>
            <button
              className={`px-4 py-2 rounded-lg bg-success-${userVote[project.idProjeto] === UserChoice.YES ? '500' : '100'}`}
              onClick={() => handleChangeUserVote(project.idProjeto, UserChoice.YES)}
            >
              {UserChoiceLabels[UserChoice.YES]}
            </button>
            <button
              className={`px-4 py-2 rounded-lg bg-alert-${userVote[project.idProjeto] === UserChoice.ABSTAIN ? '500' : '100'}`}
              onClick={() => handleChangeUserVote(project.idProjeto, UserChoice.ABSTAIN)}
            >
              {UserChoiceLabels[UserChoice.ABSTAIN]}
            </button>
            <button
              className={`px-4 py-2 rounded-lg bg-error-${userVote[project.idProjeto] === UserChoice.NO ? '500' : '100'}`}
              onClick={() => handleChangeUserVote(project.idProjeto, UserChoice.NO)}
            >
              {UserChoiceLabels[UserChoice.NO]}
            </button>
          </div>
        </div>
      )
    })
  }, [handleChangeUserVote, projects, userVote])

  return projects.length > 0 ? (
    <div className='container mx-auto px-4 my-16'>
      <div className='flex flex-col items-center justify-center gap-8'>
        <div className='text-2xl font-bold'>
          {projects[0].nome_Camara}
        </div>
        <div className='text-xl font-semibold mt-4'>
          Votação Popular
        </div>
        <div className='mt-4'>
          Dê a sua opinião sobre o(s) projeto(s) abaixo:
        </div>
        {renderProjects}
        <div className='mt-4'>
          <button
            className={`px-8 py-2 rounded-lg text-white font-semibold bg-gray-${isSubmitDisabled ? '300' : '500'}`}
            disabled={isSubmitDisabled}
            onClick={() => {
              setResult({
                userIp,
                userVote
              })
            }}
          >
            Confirmar
          </button>
        </div>
        {result && (
          <div className='flex flex-col gap-2'>
            <div><strong>IP: </strong>{result?.userIp}</div>
            <div>
              {Object.entries(result.userVote)
                .filter(([, userChoice]) => !!userChoice)
                .map(([projectId, userChoice]) => (
                  <div><strong>{`Projeto ${projectId}: `}</strong>{UserChoiceLabels[userChoice as UserChoice]}</div>
                ))
              }
            </div>
          </div>
        )}
      </div>

    </div>
  ) : null
}

export default App
