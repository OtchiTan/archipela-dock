import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import TestPage from './pages/TestPage'
import DashboardPage from './pages/DasboardPage'

function App() {
  return (
    <Routes>
      <Route path="/overlay" element={<TestPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
