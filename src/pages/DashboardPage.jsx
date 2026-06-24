// src/pages/DashboardPage.jsx
import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  Users, Stethoscope, Calendar, TrendingUp,
  Clock, CheckCircle, DollarSign, Activity
} from 'lucide-react'
import { adminApi } from '../services/api'
import StatCard from '../components/ui/StatCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/**
 * ================================================================
 * DASHBOARD ADMIN — GRAPHIQUES RECHARTS
 * ================================================================
 *
 * NOUVEAUTÉ PRINCIPALE de ClinicCam vs BusCam.
 * Utilise la bibliothèque Recharts pour afficher :
 *
 *   1. <LineChart>  — RDV des 7 derniers jours (tendance)
 *   2. <BarChart>   — Répartition par statut
 *   3. <PieChart>   — RDV par spécialité médicale
 *   4. Tableau      — Top 5 médecins
 *
 * Recharts fonctionne avec des tableaux d'objets simples :
 *   [{ date: "20 déc", rdv: 5 }, { date: "21 déc", rdv: 8 }, ...]
 *
 * Chaque graphique est dans un <ResponsiveContainer> pour
 * s'adapter automatiquement à la largeur de l'écran.
 * ================================================================
 */

// Palette de couleurs pour les graphiques
const COLORS = ['#0ea5e9', '#22c55e', '#f97316', '#a855f7', '#ef4444', '#eab308']

// Labels lisibles pour les statuts
const STATUT_LABELS = {
  EN_ATTENTE: 'En attente',
  CONFIRME: 'Confirmé',
  EN_COURS: 'En cours',
  TERMINE: 'Terminé',
  ANNULE: 'Annulé',
}

export default function DashboardPage() {
  /**
   * useQuery pour charger les statistiques.
   * staleTime: 60s → ne re-fetch pas si les données ont moins d'1 minute
   */
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => adminApi.getStats(),
    staleTime: 1000 * 60, // 1 minute
  })

  const stats = data?.data?.data

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <LoadingSpinner message="Chargement du dashboard..." />
    </div>
  )

  if (isError) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-700 font-semibold mb-3">Erreur de chargement des statistiques</p>
        <button onClick={() => refetch()}
          className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-red-600">
          Réessayer
        </button>
      </div>
    </div>
  )

  // Formater les données de statuts pour le BarChart
  const dataStatuts = (stats?.rdvParStatut || []).map(item => ({
    ...item,
    label: STATUT_LABELS[item.statut] || item.statut,
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* ── En-tête ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-1">Vue d'ensemble de la clinique</p>
        </div>
        <button onClick={() => refetch()}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600 border border-slate-200 hover:border-sky-300 px-4 py-2 rounded-xl transition-colors">
          <Activity size={16} />
          Actualiser
        </button>
      </div>

      {/* ── KPIs (cartes statistiques) ───────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Patients"
          value={stats?.totalPatients?.toLocaleString() || '0'}
          icon={<Users size={22} />}
          color="blue"
          trend="+5 ce mois"
        />
        <StatCard
          title="Médecins"
          value={stats?.totalMedecins || '0'}
          icon={<Stethoscope size={22} />}
          color="green"
          subtitle="actifs sur la plateforme"
        />
        <StatCard
          title="RDV Aujourd'hui"
          value={stats?.rdvAujourdhui || '0'}
          icon={<Calendar size={22} />}
          color="orange"
          subtitle={`${stats?.rdvEnAttente || 0} en attente`}
        />
        <StatCard
          title="Consultations"
          value={stats?.rdvTermines?.toLocaleString() || '0'}
          icon={<CheckCircle size={22} />}
          color="sky"
          subtitle="terminées au total"
        />
      </div>

      {/* KPIs financiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <StatCard
          title="Revenu Total"
          value={`${(stats?.revenuTotal || 0).toLocaleString('fr-CM')} FCFA`}
          icon={<DollarSign size={22} />}
          color="purple"
          subtitle="depuis l'ouverture"
        />
        <StatCard
          title="Revenu — 30 derniers jours"
          value={`${(stats?.revenu30Jours || 0).toLocaleString('fr-CM')} FCFA`}
          icon={<TrendingUp size={22} />}
          color="green"
          trend="derniers 30 jours"
        />
      </div>

      {/* ── Graphiques ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* ── GRAPHIQUE 1 : LineChart — RDV des 7 derniers jours ─ */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 mb-1">Activité des 7 derniers jours</h2>
          <p className="text-slate-400 text-xs mb-5">Nombre de rendez-vous par jour</p>

          {/**
           * ResponsiveContainer : rend le graphique responsive (100% de la largeur du parent)
           * height: 240 → hauteur fixe en pixels
           *
           * LineChart : graphique linéaire
           *   data : tableau de points { date, rdv }
           *
           * XAxis dataKey="date" : axe X = les dates
           * YAxis                 : axe Y = nombre de RDV (auto)
           * CartesianGrid         : grille de fond (optionnel, plus lisible)
           * Tooltip               : info-bulle au survol
           * Line dataKey="rdv"    : la courbe principale
           */}
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={stats?.rdvParJour || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value) => [`${value} RDV`, 'Rendez-vous']}
              />
              <Line
                type="monotone"
                dataKey="rdv"
                stroke="#0ea5e9"
                strokeWidth={2.5}
                dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#0284c7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ── GRAPHIQUE 2 : BarChart — Statuts des RDV ─────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 mb-1">Statuts des rendez-vous</h2>
          <p className="text-slate-400 text-xs mb-5">Répartition par état</p>

          {/**
           * BarChart : graphique en barres
           *   data        : tableau { statut, count, label }
           *   Bar fill    : couleur des barres
           *   dataKey="label" pour l'axe X (texte lisible)
           *   dataKey="count" pour les valeurs Y
           */}
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dataStatuts} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                formatter={(value) => [`${value}`, 'Rendez-vous']}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {/* Chaque barre a une couleur différente selon le statut */}
                {dataStatuts.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.statut === 'CONFIRME'  ? '#22c55e' :
                      entry.statut === 'TERMINE'   ? '#94a3b8' :
                      entry.statut === 'ANNULE'    ? '#ef4444' :
                      entry.statut === 'EN_COURS'  ? '#3b82f6' :
                      '#f59e0b'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* ── GRAPHIQUE 3 : PieChart — Par spécialité ──────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 mb-1">RDV par spécialité</h2>
          <p className="text-slate-400 text-xs mb-5">Répartition des consultations</p>

          {/**
           * PieChart : graphique camembert
           *   Pie data     : tableau { name, value }
           *   dataKey="value" : valeurs des tranches
           *   nameKey="name"  : noms affichés
           *   Cell fill       : couleur de chaque tranche
           *   outerRadius     : rayon externe (taille du camembert)
           *   innerRadius     : si > 0 → donut chart
           *   label           : affiche le nom sur chaque tranche
           */}
          {stats?.rdvParSpecialite?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={stats.rdvParSpecialite}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={40}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {stats.rdvParSpecialite.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value, name) => [`${value} RDV`, name]}
                />
                <Legend iconType="circle" iconSize={10}
                  formatter={(value) => <span style={{ fontSize: '11px', color: '#475569' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-slate-400 text-sm">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* ── TOP 5 MÉDECINS ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-bold text-slate-900 mb-1">Top médecins</h2>
          <p className="text-slate-400 text-xs mb-5">Par nombre de consultations terminées</p>

          {(stats?.topMedecins || []).length === 0 ? (
            <div className="h-60 flex items-center justify-center text-slate-400 text-sm">
              Aucune consultation terminée
            </div>
          ) : (
            <div className="space-y-3">
              {(stats?.topMedecins || []).map((m, i) => {
                const maxConsultations = stats.topMedecins[0]?.consultations || 1
                const pourcentage = Math.round((m.consultations / maxConsultations) * 100)
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    {/* Rang */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${i === 0 ? 'bg-yellow-400 text-white' :
                        i === 1 ? 'bg-slate-300 text-white' :
                        i === 2 ? 'bg-orange-400 text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">Dr. {m.nom}</p>
                        <p className="text-xs text-slate-500 flex-shrink-0 ml-2">{m.consultations} RDV</p>
                      </div>
                      <p className="text-xs text-slate-400 mb-1">{m.specialite}</p>
                      {/* Barre de progression */}
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full transition-all"
                          style={{ width: `${pourcentage}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
