// src/pages/RegisterPage.jsx
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { Stethoscope } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await registerUser({
        firstName: data.firstName, lastName: data.lastName,
        email: data.email, password: data.password,
        phone: data.phone || undefined,
        genre: data.genre || undefined,
        role: 'PATIENT',
      })
      toast.success('Compte créé ! Bienvenue sur ClinicCam 🏥')
      navigate('/medecins')
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Stethoscope size={32} className="text-sky-500" />ClinicCam
          </div>
          <p className="text-slate-500 mt-2">Créez votre compte patient</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom</label>
                <input type="text" placeholder="Jean"
                  {...register('firstName', { required: 'Obligatoire' })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.firstName ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                <input type="text" placeholder="Kamga"
                  {...register('lastName', { required: 'Obligatoire' })}
                  className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.lastName ? 'border-red-400' : 'border-slate-200'}`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input type="email" placeholder="votre@email.com"
                {...register('email', { required: 'Obligatoire', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Email invalide' } })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.email ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Téléphone</label>
                <input type="tel" placeholder="+237 6XX XXX XXX"
                  {...register('phone')}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Genre</label>
                <select {...register('genre')}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                  <option value="">Non précisé</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <input type="password" placeholder="••••••••"
                {...register('password', { required: 'Obligatoire', minLength: { value: 6, message: 'Min 6 caractères' } })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.password ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer mot de passe</label>
              <input type="password" placeholder="••••••••"
                {...register('confirmPassword', { required: 'Obligatoire', validate: v => v === password || 'Les mots de passe ne correspondent pas' })}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.confirmPassword ? 'border-red-400' : 'border-slate-200'}`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-semibold py-3 rounded-xl transition-colors mt-2">
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Déjà inscrit ?{' '}
          <Link to="/login" className="text-sky-500 hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
