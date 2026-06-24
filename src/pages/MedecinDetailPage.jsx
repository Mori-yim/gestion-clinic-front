// src/pages/MedecinDetailPage.jsx
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Clock, Phone, Mail, Calendar, Star, Award } from 'lucide-react'
import { medecinApi } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { useAuth } from '../context/AuthContext'

/**
 * ================================================================
 * PAGE DÉTAIL MÉDECIN (PUBLIC)
 * ================================================================
 * Fiche complète : photo, biographie, tarif, bouton prise de RDV
 * ================================================================
 */
export default function MedecinDetailPage() {
  const { id } = useParams()
  const { isAuthenticated, isPatient } = useAuth()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['medecin', id],
    queryFn: () => medecinApi.getById(id),
  })

  const medecin = data?.data?.data

  if (isLoading) return <LoadingSpinner message="Chargement du médecin..." />
  if (isError || !medecin) return (
    <div className="text-center py-20 text-slate-500">Médecin introuvable</div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ---- Colonne gauche : Infos principales ---- */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center sticky top-4">
            <img
              src={medecin.photoUrl ||
                `https://ui-avatars.com/api/?name=${medecin.firstName}+${medecin.lastName}&background=0ea5e9&color=fff&size=120`}
              alt={medecin.titre}
              className="w-28 h-28 rounded-2xl object-cover mx-auto mb-4 shadow"
            />
            <h1 className="font-bold text-slate-900 text-xl">{medecin.titre}</h1>
            <p className="text-sky-600 font-medium mt-1">{medecin.specialite}</p>

            <div className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full ${
              medecin.disponible ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
            }`}>
              {medecin.disponible ? '● Disponible' : '● Indisponible'}
            </div>

            {/* Infos pratiques */}
            <div className="mt-5 space-y-3 text-sm text-left">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock size={15} className="text-sky-500 flex-shrink-0" />
                <span>Consultation : {medecin.dureeConsultationMinutes} min</span>
              </div>
              {medecin.phone && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone size={15} className="text-sky-500 flex-shrink-0" />
                  <span>{medecin.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <Mail size={15} className="text-sky-500 flex-shrink-0" />
                <span className="truncate">{medecin.email}</span>
              </div>
              {medecin.tarifConsultation && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 font-semibold">
                  <span className="text-slate-500">Tarif</span>
                  <span className="text-sky-700 text-base">
                    {medecin.tarifConsultation.toLocaleString('fr-CM')} FCFA
                  </span>
                </div>
              )}
            </div>

            {/* Bouton prise de RDV */}
            {medecin.disponible && (
              <div className="mt-5">
                {isAuthenticated && isPatient ? (
                  <Link
                    to={`/prendre-rdv/${medecin.id}`}
                    className="block w-full bg-sky-500 hover:bg-sky-600 text-white font-bold
                               py-3 rounded-xl transition-colors text-center"
                  >
                    <Calendar size={16} className="inline mr-2" />
                    Prendre rendez-vous
                  </Link>
                ) : !isAuthenticated ? (
                  <Link
                    to="/login"
                    className="block w-full bg-sky-500 hover:bg-sky-600 text-white font-bold
                               py-3 rounded-xl transition-colors text-center"
                  >
                    Connexion pour RDV
                  </Link>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* ---- Colonne droite : Biographie + détails ---- */}
        <div className="md:col-span-2 space-y-5">
          {/* Biographie */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
              <Award size={20} className="text-sky-500" />
              À propos
            </h2>
            <p className="text-slate-600 leading-relaxed">
              {medecin.biographie || 'Aucune biographie disponible pour ce médecin.'}
            </p>
          </div>

          {/* Numéro d'ordre */}
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-5">
            <h3 className="font-semibold text-sky-900 mb-2 flex items-center gap-2">
              <Star size={16} className="text-sky-500" />
              Certification médicale
            </h3>
            <p className="text-sm text-sky-700">
              Médecin certifié par l'Ordre des Médecins du Cameroun
              {medecin.numeroOrdre && (
                <span className="font-mono ml-2 bg-white px-2 py-0.5 rounded border border-sky-200">
                  {medecin.numeroOrdre}
                </span>
              )}
            </p>
          </div>

          {/* Comment se passe une consultation */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="font-bold text-slate-900 text-lg mb-4">Comment prendre RDV ?</h2>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Créez votre compte patient gratuitement' },
                { step: '2', text: 'Choisissez votre créneau parmi les disponibilités' },
                { step: '3', text: 'Décrivez votre motif de consultation' },
                { step: '4', text: 'Le médecin confirme votre rendez-vous' },
              ].map(item => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-sky-500 text-white text-sm font-bold
                                  flex items-center justify-center flex-shrink-0">
                    {item.step}
                  </div>
                  <p className="text-slate-600 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
