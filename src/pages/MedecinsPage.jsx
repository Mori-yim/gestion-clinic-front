// src/pages/MedecinsPage.jsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { medecinApi, specialiteApi } from '../services/api'
import MedecinCard from '../components/MedecinCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/**
 * ================================================================
 * PAGE LISTE DES MÉDECINS (PUBLIC)
 * ================================================================
 * Filtre par spécialité + recherche textuelle côté client.
 * ================================================================
 */
export default function MedecinsPage() {
  const [specialiteFiltre, setSpecialiteFiltre] = useState('')
  const [search, setSearch] = useState('')

  // Charger tous les médecins
  const { data: medecinData, isLoading } = useQuery({
    queryKey: ['medecins', specialiteFiltre],
    queryFn: () => medecinApi.getAll(specialiteFiltre || undefined),
  })

  // Charger les spécialités pour le filtre
  const { data: specialiteData } = useQuery({
    queryKey: ['specialites'],
    queryFn: () => specialiteApi.getAll(),
  })

  const medecins = medecinData?.data?.data || []
  const specialites = specialiteData?.data?.data || []

  // Filtre de recherche côté client (nom du médecin)
  const medecinsFiltres = medecins.filter(m =>
    search === '' ||
    m.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    m.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    m.specialite?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Nos médecins</h1>
        <p className="text-slate-500 mt-1">{medecins.length} médecin(s) disponible(s)</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Recherche par nom */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un médecin..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        {/* Filtre par spécialité */}
        <select
          value={specialiteFiltre}
          onChange={e => setSpecialiteFiltre(e.target.value)}
          className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
        >
          <option value="">Toutes les spécialités</option>
          {specialites.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Grille des médecins */}
      {isLoading ? (
        <LoadingSpinner message="Chargement des médecins..." />
      ) : medecinsFiltres.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl">
          <p className="text-slate-400">Aucun médecin trouvé pour ces critères</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medecinsFiltres.map(m => <MedecinCard key={m.id} medecin={m} />)}
        </div>
      )}
    </div>
  )
}
