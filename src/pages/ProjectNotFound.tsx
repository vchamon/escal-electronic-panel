const ProjectNotFound = () => {
  return (
    <div className='container mx-auto px-4 my-16'>
      <div className='flex flex-col items-center justify-center gap-6 text-center max-w-lg mx-auto'>
        <div className='text-6xl font-bold text-error-500'>404</div>
        <div className='text-2xl font-bold text-gray-800'>
          Projeto não encontrado
        </div>
        <p className='text-gray-600'>
          Não foi possível localizar a votação solicitada. Verifique se o link está correto ou se a votação ainda está disponível.
        </p>
      </div>
    </div>
  )
}

export default ProjectNotFound
