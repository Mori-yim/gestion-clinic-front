// src/components/ui/StatCard.jsx
/**
 * Carte KPI pour le dashboard.
 * Affiche une valeur, un label, une icône et une tendance.
 *
 * Props :
 *   title   : "Total Patients"
 *   value   : "247"
 *   icon    : <Users size={24} />
 *   color   : "blue" | "green" | "purple" | "orange" | "red"
 *   trend   : "+12% ce mois" (optionnel)
 */
export default function StatCard({ title, value, icon, color = 'blue', trend, subtitle }) {
  const colors = {
    blue:   { bg: 'bg-blue-50',   icon: 'text-blue-500',   border: 'border-blue-100' },
    green:  { bg: 'bg-green-50',  icon: 'text-green-500',  border: 'border-green-100' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-500', border: 'border-purple-100' },
    orange: { bg: 'bg-orange-50', icon: 'text-orange-500', border: 'border-orange-100' },
    red:    { bg: 'bg-red-50',    icon: 'text-red-500',    border: 'border-red-100' },
    sky:    { bg: 'bg-sky-50',    icon: 'text-sky-500',    border: 'border-sky-100' },
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`bg-white rounded-2xl border ${c.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${c.bg}`}>
          <span className={c.icon}>{icon}</span>
        </div>
        {trend && (
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-600 mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}
