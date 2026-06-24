// src/pages/HomePage.jsx
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Stethoscope, Calendar, Shield, Clock, ArrowRight } from 'lucide-react'
import { medecinApi } from '../services/api'
import MedecinCard from '../components/MedecinCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/**
 * ================================================================
 * PAGE D'ACCUEIL — CLINICCAM
 * ================================================================
 * Sections :
 *   1. Hero avec appel à l'action
 *   2. Avantages de la plateforme
 *   3. Aperçu de quelques médecins (3 premiers)
 * ================================================================
 */
export default function HomePage() {
  // Charger les 3 premiers médecins pour la vitrine
  const { data, isLoading } = useQuery({
    queryKey: ['medecins-accueil'],
    queryFn: () => medecinApi.getAll(),
  })

  const medecins = (data?.data?.data || []).slice(0, 3)

  return (
    <div>
      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-sky-700/50 text-sky-200 text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Plateforme médicale disponible 24h/24
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Votre santé,
            <span className="text-sky-400"> notre priorité</span>
          </h1>

          <p className="text-sky-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Prenez rendez-vous avec les meilleurs médecins de Douala et Yaoundé.
            Rapide, simple et sécurisé.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/medecins"
              className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-4 rounded-xl
                         flex items-center justify-center gap-2 transition-colors text-lg"
            >
              <Stethoscope size={20} />
              Trouver un médecin
            </Link>
            <Link
              to="/register"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4
                         rounded-xl flex items-center justify-center gap-2 transition-colors backdrop-blur-sm"
            >
              Créer mon compte
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-10 border-t border-sky-700/50">
            {[
              { val: '6+', label: 'Médecins' },
              { val: '5', label: 'Spécialités' },
              { val: '24/7', label: 'Disponible' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold text-white">{s.val}</p>
                <p className="text-sky-300 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          AVANTAGES
          ============================================================ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-12">
            Pourquoi choisir ClinicCam ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar size={32} className="text-sky-500" />,
                title: 'RDV en ligne 24h/24',
                desc: 'Prenez rendez-vous à toute heure depuis votre téléphone ou ordinateur, sans attente téléphonique.'
              },
              {
                icon: <Shield size={32} className="text-green-500" />,
                title: 'Médecins certifiés',
                desc: 'Tous nos médecins sont vérifiés et enregistrés à l\'Ordre des médecins du Cameroun.'
              },
              {
                icon: <Clock size={32} className="text-orange-500" />,
                title: 'Rappels automatiques',
                desc: 'Recevez des confirmations et rappels pour ne jamais manquer votre rendez-vous.'
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          APERÇU DES MÉDECINS
          ============================================================ */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Nos médecins</h2>
              <p className="text-slate-500 mt-1">Des spécialistes à votre service</p>
            </div>
            <Link
              to="/medecins"
              className="text-sky-600 hover:text-sky-700 text-sm font-semibold flex items-center gap-1 transition-colors"
            >
              Voir tous <ArrowRight size={16} />
            </Link>
          </div>

          {isLoading ? (
            <LoadingSpinner message="Chargement des médecins..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {medecins.map(m => <MedecinCard key={m.id} medecin={m} />)}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/medecins"
              className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold
                         px-8 py-3 rounded-xl transition-colors"
            >
              Voir tous les médecins
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
