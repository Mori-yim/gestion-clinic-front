// src/pages/AgendaMedecinPage.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format, startOfWeek, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, XCircle } from 'lucide-react'
import { medecinApi, rdvApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Badge from '../components/ui/Badge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

/**
 * ================================================================
 * PAGE AGENDA MÉDECIN
 * ================================================================
 * Vue semaine avec navigation.
 * Le médecin peut confirmer/terminer ses RDV et ajouter des notes.
 * ================================================================
 */
export default function AgendaMedecinPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [semaine, setSemaine] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [rdvSelectionne, setRdvSelectionne] = useState(null)
  const [notes, setNotes] = useState('')
  const [ordonnance, setOrdonnance] = useState('')

  const debutSemaine = format(semaine, 'yyyy-MM-dd')
  const finSemaine = format(addDays(semaine, 6), 'yyyy-MM-dd')

  const { data, isLoading } = useQuery({
    queryKey: ['agenda', user?.id, debutSemaine],
    queryFn: () => medecinApi.getAgenda(user.id, debutSemaine, finSemaine),
    enabled: !!user?.id,
  })

  const rdvs = data?.data?.data || []

  const { mutate: updateRdv, isPending } = useMutation({
    mutationFn: ({ id, payload }) => rdvApi.update(id, payload),
    onSuccess: () => {
      toast.success('Rendez-vous mis à jour')
      queryClient.invalidateQueries({ queryKey: ['agenda'] })
      setRdvSelectionne(null)
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur'),
  })

  // Grouper les RDV par jour de la semaine
  const rdvParJour = {}
  for (let i = 0; i < 6; i++) {
    const jour = format(addDays(semaine, i), 'yyyy-MM-dd')
    rdvParJour[jour] = rdvs.filter(r =>
      format(new Date(r.dateHeure), 'yyyy-MM-dd') === jour
    )
  }

  const handleConfirmer = (rdv) => {
    updateRdv({ id: rdv.id, payload: { statut: 'CONFIRME' } })
  }

  const handleTerminer = (rdv) => {
    updateRdv({ id: rdv.id, payload: { statut: 'TERMINE', notesMedecin: notes, ordonnance } })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Calendar size={28} className="text-sky-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Mon Agenda</h1>
            <p className="text-slate-500 text-sm">
              Semaine du {format(semaine, 'd MMM', { locale: fr })} au {format(addDays(semaine, 5), 'd MMM yyyy', { locale: fr })}
            </p>
          </div>
        </div>

        {/* Navigation semaine */}
        <div className="flex items-center gap-2">
          <button onClick={() => setSemaine(s => addDays(s, -7))}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => setSemaine(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            Aujourd'hui
          </button>
          <button onClick={() => setSemaine(s => addDays(s, 7))}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(rdvParJour).map(([jour, rdvsDuJour]) => {
            const date = new Date(jour + 'T00:00:00')
            const estAujourdhui = jour === format(new Date(), 'yyyy-MM-dd')
            return (
              <div key={jour} className={`rounded-2xl border p-3 min-h-[200px] ${estAujourdhui ? 'border-sky-300 bg-sky-50' : 'border-slate-100 bg-white'} shadow-sm`}>
                {/* En-tête jour */}
                <div className="text-center mb-3 pb-2 border-b border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase">
                    {format(date, 'EEE', { locale: fr })}
                  </p>
                  <p className={`text-xl font-bold ${estAujourdhui ? 'text-sky-600' : 'text-slate-900'}`}>
                    {format(date, 'd')}
                  </p>
                </div>

                {/* RDV du jour */}
                <div className="space-y-2">
                  {rdvsDuJour.length === 0 ? (
                    <p className="text-xs text-slate-300 text-center py-4">Libre</p>
                  ) : rdvsDuJour.map(rdv => (
                    <button key={rdv.id} onClick={() => { setRdvSelectionne(rdv); setNotes(rdv.notesMedecin || ''); setOrdonnance(rdv.ordonnance || '') }}
                      className="w-full text-left p-2 rounded-lg bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all">
                      <p className="text-xs font-bold text-slate-900">
                        {format(new Date(rdv.dateHeure), 'HH:mm')}
                      </p>
                      <p className="text-xs text-slate-600 truncate">{rdv.patient?.fullName}</p>
                      <Badge statut={rdv.statut} />
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modal détail RDV ──────────────────────────────────── */}
      {rdvSelectionne && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-bold text-slate-900 text-lg">Détail du rendez-vous</h2>
              <button onClick={() => setRdvSelectionne(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={22} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Infos patient */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-semibold">{rdvSelectionne.patient?.fullName}</p>
                <p className="text-sm text-slate-500">{rdvSelectionne.patient?.email}</p>
                <p className="text-sm text-slate-600 mt-2"><strong>Motif :</strong> {rdvSelectionne.motif}</p>
                <p className="text-sm text-slate-600"><strong>Heure :</strong> {format(new Date(rdvSelectionne.dateHeure), 'dd MMM yyyy à HH:mm', { locale: fr })}</p>
                <div className="mt-2"><Badge statut={rdvSelectionne.statut} /></div>
              </div>

              {/* Notes médecin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes de consultation</label>
                <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Diagnostic, observations..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
                />
              </div>

              {/* Ordonnance */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ordonnance</label>
                <textarea rows={3} value={ordonnance} onChange={e => setOrdonnance(e.target.value)} placeholder="Médicaments prescrits, posologie..."
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {rdvSelectionne.statut === 'EN_ATTENTE' && (
                  <button onClick={() => handleConfirmer(rdvSelectionne)} disabled={isPending}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle size={16} /> Confirmer
                  </button>
                )}
                {(rdvSelectionne.statut === 'CONFIRME' || rdvSelectionne.statut === 'EN_COURS') && (
                  <button onClick={() => handleTerminer(rdvSelectionne)} disabled={isPending}
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                    <CheckCircle size={16} /> Terminer & Sauvegarder
                  </button>
                )}
                {rdvSelectionne.statut !== 'ANNULE' && rdvSelectionne.statut !== 'TERMINE' && (
                  <button onClick={() => updateRdv({ id: rdvSelectionne.id, payload: { statut: 'ANNULE', raisonAnnulation: 'Annulé par le médecin' } })} disabled={isPending}
                    className="px-4 py-2.5 border border-red-200 text-red-500 hover:bg-red-50 font-medium rounded-xl transition-colors text-sm">
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
