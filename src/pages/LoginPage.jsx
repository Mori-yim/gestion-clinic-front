// src/pages/LoginPage.jsx
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const user = await login(data.email, data.password)
      toast.success(`Bienvenue, ${user.firstName} ! 🏥`)
      // Rediriger selon le rôle
      if (user.role === 'ADMIN') navigate('/dashboard')
      else if (user.role === 'MEDECIN') navigate('/agenda')
      else navigate('/medecins')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Email ou mot de passe incorrect')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Stethoscope size={32} className="text-sky-500" />
            ClinicCam
          </div>
          <p className="text-slate-500 mt-2">Connectez-vous à votre espace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" placeholder="votre@email.com"
                {...register('email', {
                  required: "L'email est obligatoire",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email invalide' }
                })}
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                  {...register('password', { required: 'Mot de passe obligatoire' })}
                  className={`w-full px-4 py-3 pr-12 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold py-3 rounded-xl transition-colors">
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Comptes de démo */}
          <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 mb-2">Comptes de démonstration :</p>
            <p>👔 Admin : admin@cliniccam.cm / Admin123!</p>
            <p>🩺 Médecin : dr.mbarga@cliniccam.cm / Medecin123!</p>
            <p>👤 Patient : alain.talla@gmail.com / Patient123!</p>
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-sky-500 hover:underline font-medium">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}
