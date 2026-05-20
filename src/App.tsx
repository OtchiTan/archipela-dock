import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DasboardPage";
import LoginPage from "./pages/LoginPage";
import StatsPage from "./pages/StatsPage";
import TestPage from "./pages/TestPage";

function App() {
  return (
    <Routes>
      <Route path="/overlay" element={<TestPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/stats" element={<StatsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
