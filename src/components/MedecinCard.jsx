// src/components/MedecinCard.jsx
import { Link } from 'react-router-dom'
import { Star, Clock, MapPin, Calendar } from 'lucide-react'

/**
 * ================================================================
 * COMPOSANT CARTE MÉDECIN
 * ================================================================
 * Affiche la fiche résumée d'un médecin sur la liste publique.
 *
 * Props :
 *   medecin : { id, titre, specialite, tarifConsultation,
 *               biographie, photoUrl, disponible, dureeConsultationMinutes }
 * ================================================================
 */
export default function MedecinCard({ medecin }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5">

      {/* En-tête : photo + nom + spécialité */}
      <div className="flex items-start gap-4 mb-4">
        <img
          src={medecin.photoUrl || `https://ui-avatars.com/api/?name=${medecin.firstName}+${medecin.lastName}&background=0ea5e9&color=fff&size=80`}
          alt={medecin.titre}
          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-slate-900 text-base truncate">{medecin.titre}</h3>
          <p className="text-sky-600 text-sm font-medium">{medecin.specialite}</p>
          <div className="flex items-center gap-1 mt-1">
            {/* Badge disponibilité */}
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              medecin.disponible
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}>
              {medecin.disponible ? '● Disponible' : '● Indisponible'}
            </span>
          </div>
        </div>
      </div>

      {/* Biographie (tronquée à 2 lignes) */}
      {medecin.biographie && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          {medecin.biographie}
        </p>
      )}

      {/* Infos pratiques */}
      <div className="flex items-center justify-between text-sm text-slate-500 mb-4 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Clock size={14} className="text-slate-400" />
          {medecin.dureeConsultationMinutes || 30} min
        </span>
        <span className="font-bold text-sky-700 text-base">
          {medecin.tarifConsultation
            ? medecin.tarifConsultation.toLocaleString('fr-CM') + ' FCFA'
            : 'Tarif variable'}
        </span>
      </div>

      {/* Boutons d'action */}
      <div className="flex gap-2">
        <Link
          to={`/medecins/${medecin.id}`}
          className="flex-1 text-center border border-sky-200 text-sky-600 hover:bg-sky-50 text-sm font-medium py-2 rounded-xl transition-colors"
        >
          Voir le profil
        </Link>
        {medecin.disponible && (
          <Link
            to={`/prendre-rdv/${medecin.id}`}
            className="flex-1 text-center bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold py-2 rounded-xl transition-colors flex items-center justify-center gap-1"
          >
            <Calendar size={14} />
            Prendre RDV
          </Link>
        )}
      </div>
    </div>
  )
}
