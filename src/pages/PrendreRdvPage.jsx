// src/pages/PrendreRdvPage.jsx
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { format, addDays, setHours, setMinutes } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, Clock, CheckCircle } from 'lucide-react'
import { medecinApi, rdvApi } from '../services/api'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

/**
 * ================================================================
 * PAGE PRISE DE RENDEZ-VOUS
 * ================================================================
 * Flux :
 *   1. Affiche le médecin choisi
 *   2. Grille de créneaux horaires cliquables
 *   3. Formulaire du motif
 *   4. Confirmation
 * ================================================================
 */
export default function PrendreRdvPage() {
  const { medecinId } = useParams()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 1))
  const [selectedHeure, setSelectedHeure] = useState(null)
  const [confirmation, setConfirmation] = useState(null)

  const { register, handleSubmit, formState: { errors } } = useForm()

  // Charger le médecin
  const { data: medecinData, isLoading } = useQuery({
    queryKey: ['medecin', medecinId],
    queryFn: () => medecinApi.getById(medecinId),
  })

  const medecin = medecinData?.data?.data

  // Mutation prise de RDV
  const { mutate: prendrerdv, isPending } = useMutation({
    mutationFn: (data) => rdvApi.creer(data),
    onSuccess: (res) => {
      setConfirmation(res.data.data)
      toast.success('Rendez-vous pris ! 🎉')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la prise de RDV')
    }
  })

  // Générer les créneaux horaires (8h → 17h, par pas de 30 min)
  const creneaux = []
  for (let h = 8; h < 17; h++) {
    for (let m = 0; m < 60; m += medecin?.dureeConsultationMinutes || 30) {
      creneaux.push({ h, m, label: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` })
    }
  }

  // Jours disponibles (7 prochains jours, sauf dimanche)
  const joursDisponibles = []
  for (let i = 1; i <= 8; i++) {
    const d = addDays(new Date(), i)
    if (d.getDay() !== 0) joursDisponibles.push(d) // Exclure dimanche
    if (joursDisponibles.length >= 6) break
  }

  const onSubmit = (data) => {
    if (!selectedHeure) { toast.error('Veuillez choisir un créneau horaire'); return }
    const dateHeure = setMinutes(setHours(selectedDate, selectedHeure.h), selectedHeure.m)
    prendrerdv({
      medecinId: parseInt(medecinId),
      dateHeure: format(dateHeure, "yyyy-MM-dd'T'HH:mm:ss"),
      motif: data.motif,
    })
  }

  // ── Écran de confirmation ────────────────────────────────────
  if (confirmation) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-8">
          <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Demande envoyée !</h2>
          <p className="text-slate-500 mb-6">Votre rendez-vous est en attente de confirmation par le médecin</p>
          <div className="bg-sky-50 rounded-xl p-4 text-left mb-6 space-y-2">
            <p className="text-sm"><span className="text-slate-500">Médecin :</span> <span className="font-semibold">{confirmation.medecin?.titre}</span></p>
            <p className="text-sm"><span className="text-slate-500">Date :</span> <span className="font-semibold">{confirmation.dateHeure && format(new Date(confirmation.dateHeure), 'EEEE dd MMMM yyyy à HH:mm', { locale: fr })}</span></p>
            <p className="text-sm"><span className="text-slate-500">Motif :</span> <span className="font-semibold">{confirmation.motif}</span></p>
            <p className="text-sm"><span className="text-slate-500">Statut :</span> <span className="font-semibold text-yellow-600">En attente</span></p>
          </div>
          <button onClick={() => navigate('/mes-rdv')}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors">
            Voir mes rendez-vous
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) return <LoadingSpinner />
  if (!medecin) return <div className="text-center py-16 text-slate-400">Médecin introuvable</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Prendre rendez-vous</h1>
      <p className="text-slate-500 mb-8">avec <span className="text-sky-600 font-semibold">{medecin.titre}</span> — {medecin.specialite}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* ── Choix du jour ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar size={18} className="text-sky-500" />
            Choisir un jour
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {joursDisponibles.map((jour, i) => {
              const isSelected = format(jour, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
              return (
                <button key={i} type="button"
                  onClick={() => { setSelectedDate(jour); setSelectedHeure(null) }}
                  className={`p-2 rounded-xl text-center transition-all border text-sm
                    ${isSelected
                      ? 'bg-sky-500 text-white border-sky-500 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'}`}>
                  <p className="text-xs opacity-75 capitalize">{format(jour, 'EEE', { locale: fr })}</p>
                  <p className="font-bold text-base">{format(jour, 'dd')}</p>
                  <p className="text-xs opacity-75">{format(jour, 'MMM', { locale: fr })}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Choix du créneau ─────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Clock size={18} className="text-sky-500" />
            Choisir un créneau
          </h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {creneaux.map((c, i) => {
              const isSelected = selectedHeure?.label === c.label
              return (
                <button key={i} type="button"
                  onClick={() => setSelectedHeure(c)}
                  className={`py-2 rounded-xl text-sm font-medium transition-all border
                    ${isSelected
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-sky-300'}`}>
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Motif de consultation ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-slate-900 mb-4">Motif de consultation</h2>
          <textarea
            rows={4}
            placeholder="Décrivez brièvement la raison de votre consultation..."
            {...register('motif', { required: 'Le motif est obligatoire', minLength: { value: 10, message: 'Trop court (10 caractères minimum)' } })}
            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none
              ${errors.motif ? 'border-red-400' : 'border-slate-200'}`}
          />
          {errors.motif && <p className="text-red-500 text-xs mt-1">{errors.motif.message}</p>}
        </div>

        {/* ── Récapitulatif + bouton ─────────────────────── */}
        {selectedHeure && (
          <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
            <p className="text-sm text-sky-800 font-medium">
              📅 RDV le <strong>{format(selectedDate, 'EEEE dd MMMM', { locale: fr })}</strong> à <strong>{selectedHeure.label}</strong>
              {' '} avec <strong>{medecin.titre}</strong>
            </p>
            {medecin.tarifConsultation && (
              <p className="text-sm text-sky-700 mt-1">
                💰 Tarif : {medecin.tarifConsultation.toLocaleString('fr-CM')} FCFA
              </p>
            )}
          </div>
        )}

        <button type="submit" disabled={isPending || !selectedHeure}
          className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 disabled:cursor-not-allowed
                     text-white font-bold py-4 rounded-xl transition-colors text-base">
          {isPending ? 'Envoi...' : selectedHeure ? `Confirmer pour ${selectedHeure.label}` : 'Choisissez un créneau'}
        </button>
      </form>
    </div>
  )
}
