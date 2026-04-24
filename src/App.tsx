import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import TestPage from './pages/TestPage'
import TestArchiPage from './pages/TestArchiPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<TestPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/testarchi" element={<TestArchiPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
