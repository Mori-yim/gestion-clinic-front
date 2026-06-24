// src/components/ui/Badge.jsx
/**
 * Badge de statut coloré pour les rendez-vous.
 * Statut → couleur automatique.
 */
export default function Badge({ statut }) {
  const config = {
    EN_ATTENTE: { label: 'En attente',  cls: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    CONFIRME:   { label: 'Confirmé',    cls: 'bg-green-100  text-green-700  border-green-200'  },
    EN_COURS:   { label: 'En cours',    cls: 'bg-blue-100   text-blue-700   border-blue-200'   },
    TERMINE:    { label: 'Terminé',     cls: 'bg-slate-100  text-slate-600  border-slate-200'  },
    ANNULE:     { label: 'Annulé',      cls: 'bg-red-100    text-red-700    border-red-200'    },
  }
  const { label, cls } = config[statut] || { label: statut, cls: 'bg-slate-100 text-slate-600' }

  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  )
}
