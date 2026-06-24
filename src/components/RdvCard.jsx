// src/components/RdvCard.jsx
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { MapPin, Clock, FileText, Pill, XCircle } from 'lucide-react'
import Badge from './ui/Badge'

/**
 * ================================================================
 * COMPOSANT CARTE RENDEZ-VOUS
 * ================================================================
 * Affiche les détails d'un rendez-vous dans la liste du patient.
 *
 * Props :
 *   rdv       : objet RendezVousResponse complet
 *   onAnnuler : fonction(id) → appelée si patient annule
 *   showPatient : booléen, affiche le patient (vue médecin/admin)
 * ================================================================
 */
export default function RdvCard({ rdv, onAnnuler, showPatient = false }) {
  const dateHeure = new Date(rdv.dateHeure)
  const dateFormatee = format(dateHeure, 'EEEE dd MMMM yyyy', { locale: fr })
  const heureDepart = format(dateHeure, 'HH:mm')
  const heureFin = rdv.dateHeureFin
    ? format(new Date(rdv.dateHeureFin), 'HH:mm')
    : null

  const peutEtreAnnule = rdv.statut === 'EN_ATTENTE' || rdv.statut === 'CONFIRME'
  const estPasse = new Date(rdv.dateHeure) < new Date()

  const personne = showPatient ? rdv.patient : rdv.medecin

  return (
    <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-shadow hover:shadow-md
      ${rdv.statut === 'ANNULE' ? 'border-red-100 opacity-75' : 'border-slate-100'}`}>

      {/* Barre de couleur selon statut */}
      <div className={`h-1 ${
        rdv.statut === 'CONFIRME'  ? 'bg-green-400'  :
        rdv.statut === 'EN_COURS'  ? 'bg-blue-400'   :
        rdv.statut === 'TERMINE'   ? 'bg-slate-300'  :
        rdv.statut === 'ANNULE'    ? 'bg-red-400'    :
        'bg-yellow-400'
      }`} />

      <div className="p-5">
        {/* En-tête : photo + nom médecin/patient + badge statut */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={personne?.photoUrl ||
                `https://ui-avatars.com/api/?name=${personne?.firstName}+${personne?.lastName}&background=0ea5e9&color=fff&size=60`}
              alt={personne?.titre || personne?.fullName}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-slate-900">
                {showPatient ? personne?.fullName : personne?.titre || personne?.fullName}
              </p>
              <p className="text-sky-600 text-sm">{rdv.medecin?.specialite}</p>
            </div>
          </div>
          <Badge statut={rdv.statut} />
        </div>

        {/* Date et heure */}
        <div className="bg-slate-50 rounded-xl p-3 mb-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
            <Clock size={15} className="text-sky-500" />
            <span>{heureDepart}{heureFin ? ` → ${heureFin}` : ''}</span>
          </div>
          <span className="text-slate-400">·</span>
          <span className="text-sm text-slate-600 capitalize">{dateFormatee}</span>
        </div>

        {/* Motif */}
        {rdv.motif && (
          <div className="flex items-start gap-2 mb-3 text-sm text-slate-600">
            <FileText size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="line-clamp-2">{rdv.motif}</span>
          </div>
        )}

        {/* Tarif */}
        {rdv.tarif && (
          <p className="text-sm font-semibold text-sky-700 mb-3">
            {rdv.tarif.toLocaleString('fr-CM')} FCFA
          </p>
        )}

        {/* Notes médecin (si RDV terminé) */}
        {rdv.notesMedecin && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-3">
            <p className="text-xs font-semibold text-blue-700 mb-1">📋 Notes du médecin</p>
            <p className="text-sm text-blue-800">{rdv.notesMedecin}</p>
          </div>
        )}

        {/* Ordonnance */}
        {rdv.ordonnance && (
          <div className="bg-green-50 border border-green-100 rounded-xl p-3 mb-3">
            <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1">
              <Pill size={12} /> Ordonnance
            </p>
            <p className="text-sm text-green-800">{rdv.ordonnance}</p>
          </div>
        )}

        {/* Raison annulation */}
        {rdv.raisonAnnulation && (
          <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-3">
            Annulé : {rdv.raisonAnnulation}
          </p>
        )}

        {/* Bouton annuler (patient seulement, si annulable) */}
        {onAnnuler && peutEtreAnnule && !estPasse && (
          <button
            onClick={() => onAnnuler(rdv.id)}
            className="flex items-center gap-1.5 text-red-500 hover:text-red-700 hover:bg-red-50
                       text-sm px-3 py-1.5 rounded-lg transition-colors w-full justify-center border border-red-100"
          >
            <XCircle size={14} />
            Annuler ce rendez-vous
          </button>
        )}
      </div>
    </div>
  )
}
