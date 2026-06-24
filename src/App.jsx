// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MedecinsPage from './pages/MedecinsPage'
import MedecinDetailPage from './pages/MedecinDetailPage'
import PrendreRdvPage from './pages/PrendreRdvPage'
import MesRdvPage from './pages/MesRdvPage'
import AgendaMedecinPage from './pages/AgendaMedecinPage'
import DashboardPage from './pages/DashboardPage'
import LoadingSpinner from './components/ui/LoadingSpinner'

/**
 * Route protégée — redirige si non connecté ou rôle insuffisant
 */
function ProtectedRoute({ children, roles = [] }) {
  const { isAuthenticated, user, isLoading } = useAuth()
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (roles.length > 0 && !roles.includes(user?.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/medecins" element={<MedecinsPage />} />
          <Route path="/medecins/:id" element={<MedecinDetailPage />} />

          {/* PATIENT */}
          <Route path="/prendre-rdv/:medecinId" element={
            <ProtectedRoute roles={['PATIENT']}>
              <PrendreRdvPage />
            </ProtectedRoute>
          } />
          <Route path="/mes-rdv" element={
            <ProtectedRoute roles={['PATIENT']}>
              <MesRdvPage />
            </ProtectedRoute>
          } />

          {/* MÉDECIN */}
          <Route path="/agenda" element={
            <ProtectedRoute roles={['MEDECIN']}>
              <AgendaMedecinPage />
            </ProtectedRoute>
          } />

          {/* ADMIN */}
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['ADMIN']}>
              <DashboardPage />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
