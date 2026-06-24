// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope, LogOut, Calendar, LayoutDashboard, User, ClipboardList } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isMedecin, isPatient, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-sky-700 hover:text-sky-600 transition-colors">
            <Stethoscope size={26} className="text-sky-500" />
            <span>ClinicCam</span>
          </Link>

          {/* Nav centrale */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
              Accueil
            </Link>
            <Link to="/medecins" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
              Médecins
            </Link>
          </div>

          {/* Partie droite */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Liens selon le rôle */}
                {isPatient && (
                  <Link to="/mes-rdv" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600 transition-colors">
                    <ClipboardList size={16} />
                    <span className="hidden sm:inline">Mes RDV</span>
                  </Link>
                )}
                {isMedecin && (
                  <Link to="/agenda" className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600 transition-colors">
                    <Calendar size={16} />
                    <span className="hidden sm:inline">Mon Agenda</span>
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/dashboard" className="flex items-center gap-1.5 text-sm bg-sky-500 hover:bg-sky-600 text-white px-3 py-1.5 rounded-lg transition-colors">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* User info */}
                <div className="flex items-center gap-1.5 text-sm text-slate-500 border-l border-slate-200 pl-3">
                  <User size={14} />
                  <span className="hidden sm:inline">{user?.titre || user?.firstName}</span>
                  <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                    {user?.role}
                  </span>
                </div>

                <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors" title="Déconnexion">
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
