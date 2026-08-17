import { useCallback, useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'

import { fetchProjects } from '../services/projects'
import { useParams } from 'react-router-dom'
import { Project, UserChoice, UserVotes } from '../types'
import { getUserIp, getPreviousUserVotes, postUserVotes, clearUserVotes } from '../services/user'

const UserChoiceLabels = {
  [UserChoice.YES]: 'A favor',
  [UserChoice.ABSTAIN]: 'Indeciso',
  [UserChoice.NO]: 'Contra',
}

const Projects = () => {
  const [userIp, setUserIp] = useState<string>()
  const [projects, setProjects] = useState<Project[]>([])
  const [userVotes, setUserVotes] = useState<UserVotes>({})
  const [showThankYouModal, setShowThankYouModal] = useState(false)

  const { councilSocialId } = useParams()

  useEffect(() => {
    fetchProjects(councilSocialId!).then(setProjects)
    getUserIp()
      .then((ip) => {
        setUserIp(ip)
        setUserVotes(getPreviousUserVotes(councilSocialId!, ip))
      })
  }, [councilSocialId])

  const handleChangeUserVote = useCallback((projectId: number, userChoice: UserChoice) => {
    const id = projectId.toString()

    setUserVotes((previousVotes) => ({
      ...previousVotes,
      [id]: previousVotes[id] === userChoice ? null : userChoice,
    }))
  }, [])

  const handleSubmitVotes = useCallback(() => {
    postUserVotes(councilSocialId!, userIp as string, userVotes)
    setShowThankYouModal(true)
  }, [councilSocialId, userIp, userVotes])

  const handleClearVotes = useCallback(() => {
    clearUserVotes(councilSocialId!, userIp as string)
    setUserVotes({})
  }, [councilSocialId, userIp])

  const hasVotes = useMemo(
    () => projects.some((project) => userVotes[project.idProjeto.toString()] != null),
    [projects, userVotes],
  )

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
              className={`px-4 py-2 rounded-lg ${userVotes[project.idProjeto.toString()] === UserChoice.YES ? 'bg-success-500' : 'bg-success-100'}`}
              onClick={() => handleChangeUserVote(project.idProjeto, UserChoice.YES)}
            >
              {UserChoiceLabels[UserChoice.YES]}
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${userVotes[project.idProjeto.toString()] === UserChoice.ABSTAIN ? 'bg-alert-500' : 'bg-alert-100'}`}
              onClick={() => handleChangeUserVote(project.idProjeto, UserChoice.ABSTAIN)}
            >
              {UserChoiceLabels[UserChoice.ABSTAIN]}
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${userVotes[project.idProjeto.toString()] === UserChoice.NO ? 'bg-error-500' : 'bg-error-100'}`}
              onClick={() => handleChangeUserVote(project.idProjeto, UserChoice.NO)}
            >
              {UserChoiceLabels[UserChoice.NO]}
            </button>
          </div>
        </div>
      )
    })
  }, [handleChangeUserVote, projects, userVotes])

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
        <div className='flex justify-center gap-4 mt-4'>
          <button
            className={`px-8 py-2 rounded-lg text-white font-semibold ${hasVotes ? 'bg-gray-500' : 'bg-gray-300'}`}
            disabled={!hasVotes}
            onClick={handleSubmitVotes}
          >
            Confirmar
          </button>
          <button
            className={`px-8 py-2 rounded-lg font-semibold border ${hasVotes ? 'text-gray-700 border-gray-400 hover:bg-gray-50' : 'text-gray-300 border-gray-200 cursor-not-allowed'}`}
            disabled={!hasVotes}
            onClick={handleClearVotes}
          >
            Limpar votos
          </button>
        </div>
      </div>

      {showThankYouModal && (
        <dialog
          open
          className='fixed inset-0 z-50 m-0 flex h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/50 p-0'
        >
          <div className='bg-white rounded-lg px-8 py-6 text-lg font-semibold shadow-lg text-center'>
            <p>Agradecemos pelo seu voto</p>
            <button
              type='button'
              className='mt-6 px-6 py-2 rounded-lg text-white font-semibold bg-gray-500'
              onClick={() => setShowThankYouModal(false)}
            >
              Fechar
            </button>
          </div>
        </dialog>
      )}
    </div>
  ) : null
}

export default Projects
