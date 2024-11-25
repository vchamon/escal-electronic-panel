import { useEffect } from 'react'
import { fetchProjects } from './services/projects'
import { useLocation } from 'react-router-dom'

const App = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    const socialId = pathname.split('/').pop() as string
    fetchProjects(socialId).then(console.log)
  }, [])

  return (
    <div className='container mx-auto px-4'>
      <h1>Ok</h1>
    </div>
  )
}

export default App
