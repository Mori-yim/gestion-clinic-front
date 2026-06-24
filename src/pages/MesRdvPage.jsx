// src/pages/MesRdvPage.jsx
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardList } from 'lucide-react'
import { rdvApi } from '../services/api'
import RdvCard from '../components/RdvCard'
import Pagination from '../components/ui/Pagination'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import toast from 'react-hot-toast'

/**
 * ================================================================
 * PAGE MES RENDEZ-VOUS (PATIENT)
 * ================================================================
 * Liste paginée des RDV avec filtres par statut.
 * Démontre l'utilisation de la PAGINATION côté backend.
 * ================================================================
 */
export default function MesRdvPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const size = 6

  const { data, isLoading } = useQuery({
    queryKey: ['mes-rdv', page],
    queryFn: () => rdvApi.getMesRdv(page, size),
    keepPreviousData: true, // garde les données précédentes pendant le chargement
  })

  const { mutate: annuler } = useMutation({
    mutationFn: (id) => rdvApi.annuler(id, 'Annulé par le patient'),
    onSuccess: () => {
      toast.success('Rendez-vous annulé')
      queryClient.invalidateQueries({ queryKey: ['mes-rdv'] })
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Erreur'),
  })

  const handleAnnuler = (id) => {
    if (window.confirm('Confirmer l\'annulation de ce rendez-vous ?')) annuler(id)
  }

  const pageData = data?.data?.data
  const rdvs = pageData?.content || []

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardList size={28} className="text-sky-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes rendez-vous</h1>
          <p className="text-slate-500 text-sm">
            {pageData?.totalElements || 0} rendez-vous au total
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner message="Chargement de vos rendez-vous..." />
      ) : rdvs.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-16 text-center">
          <div className="text-5xl mb-4">📅</div>
          <p className="font-semibold text-slate-700 mb-2">Aucun rendez-vous</p>
          <p className="text-slate-400 text-sm mb-6">Vos rendez-vous apparaîtront ici</p>
          <a href="/medecins" className="inline-block bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
            Trouver un médecin
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rdvs.map(rdv => (
              <RdvCard key={rdv.id} rdv={rdv} onAnnuler={handleAnnuler} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={pageData?.page || 0}
            totalPages={pageData?.totalPages || 1}
            totalElements={pageData?.totalElements || 0}
            size={size}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}
