// src/components/ui/Pagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * ================================================================
 * COMPOSANT PAGINATION
 * ================================================================
 *
 * Nouveau dans ClinicCam vs BusCam.
 * Utilisé pour naviguer dans les listes paginées (patients, RDV).
 *
 * Props :
 *   page          : numéro de page courant (0-indexé)
 *   totalPages    : nombre total de pages
 *   totalElements : nombre total d'éléments
 *   size          : éléments par page
 *   onPageChange  : fonction appelée avec le nouveau numéro de page
 * ================================================================
 */
export default function Pagination({ page, totalPages, totalElements, size, onPageChange }) {
  if (totalPages <= 1) return null

  const debut = page * size + 1
  const fin = Math.min((page + 1) * size, totalElements)

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Info sur les éléments affichés */}
      <p className="text-sm text-slate-500">
        <span className="font-medium text-slate-700">{debut}–{fin}</span>
        {' '}sur{' '}
        <span className="font-medium text-slate-700">{totalElements}</span>
        {' '}résultats
      </p>

      {/* Boutons de navigation */}
      <div className="flex items-center gap-2">
        {/* Bouton Précédent */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200
                     hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={16} />
          Précédent
        </button>

        {/* Numéros de pages */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            // Afficher les pages autour de la page courante
            let pageNum = i
            if (totalPages > 5) {
              if (page <= 2) pageNum = i
              else if (page >= totalPages - 3) pageNum = totalPages - 5 + i
              else pageNum = page - 2 + i
            }
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 text-sm rounded-lg transition-colors font-medium
                  ${pageNum === page
                    ? 'bg-sky-500 text-white'
                    : 'hover:bg-slate-100 text-slate-600'
                  }`}
              >
                {pageNum + 1}
              </button>
            )
          })}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border border-slate-200
                     hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Suivant
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
