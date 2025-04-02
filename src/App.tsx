import { Route, Routes } from "react-router-dom"
import Projects from "./pages/Projects"

const App = () => {
  return (
    <Routes>
      <Route path="/projects/:councilSocialId" element={<Projects />} />
    </Routes>
  )
}

export default App
