#  ClinicCam Frontend — React 18 + Recharts

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12-22B5BF?style=flat)](https://recharts.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel)](https://vercel.com/)

Interface utilisateur de la plateforme **ClinicCam** — gestion de clinique médicale au Cameroun. Inclut un dashboard analytique avec graphiques **Recharts** interactifs.

---

##  Table des Matières

- [À propos](#-à-propos)
- [Technologies](#-technologies)
- [Pages & Fonctionnalités](#-pages--fonctionnalités)
- [Graphiques Recharts](#-graphiques-recharts)
- [Installation](#-installation)
- [Structure du projet](#-structure-du-projet)
- [Déploiement Vercel](#-déploiement-vercel)
- [Auteur](#-auteur)

---

##  À propos

ClinicCam Frontend est une SPA React avec 3 espaces distincts selon le rôle :

- **PATIENT** : consulter les médecins, prendre rendez-vous, gérer ses billets
- **MEDECIN** : agenda semaine, confirmer/terminer les RDV, ajouter notes et ordonnances
- **ADMIN** : dashboard analytique avec LineChart, BarChart et PieChart (Recharts)

**Nouveauté principale :** Dashboard avec 3 types de graphiques Recharts + pagination backend.

---

##  Technologies

| Technologie | Version | Usage |
|------------|---------|-------|
| React | 18.3 | Framework UI |
| Vite | 5.2 | Build tool |
| React Router DOM | 6.22 | Navigation SPA |
| TanStack Query | 5.28 | Cache + état serveur |
| Recharts | 2.12 | **LineChart, BarChart, PieChart** |
| Axios | 1.6 | HTTP + JWT intercepteurs |
| React Hook Form | 7.51 | Formulaires |
| Tailwind CSS | 3.4 | Design système |
| date-fns | 3.3 | Dates (locale française) |
| lucide-react | 0.363 | Icônes |

---

##  Pages & Fonctionnalités

| Page | Route | Rôle | Description |
|------|-------|------|-------------|
| Accueil | `/` | Public | Hero + aperçu 3 médecins |
| Médecins | `/medecins` | Public | Liste + filtre spécialité + recherche |
| Fiche médecin | `/medecins/:id` | Public | Profil complet + bouton RDV |
| Connexion | `/login` | Public | Redirections selon rôle |
| Inscription | `/register` | Public | Compte patient |
| Prendre RDV | `/prendre-rdv/:id` | PATIENT | Sélecteur jour + créneaux horaires |
| Mes RDV | `/mes-rdv` | PATIENT | Liste paginée + annulation |
| Agenda | `/agenda` | MEDECIN | Vue semaine + modal gestion RDV |
| Dashboard | `/dashboard` | ADMIN | Statistiques + graphiques Recharts |

---

##  Graphiques Recharts

### 1. LineChart — Activité des 7 derniers jours
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Données : [{ date: "20 déc", rdv: 5 }, ...]
<ResponsiveContainer width="100%" height={240}>
  <LineChart data={stats.rdvParJour}>
    <XAxis dataKey="date" />
    <YAxis allowDecimals={false} />
    <Tooltip />
    <Line type="monotone" dataKey="rdv" stroke="#0ea5e9" strokeWidth={2.5} />
  </LineChart>
</ResponsiveContainer>
```

### 2. BarChart — Statuts des rendez-vous
```jsx
// Données : [{ label: "Confirmé", count: 12 }, ...]
<BarChart data={dataStatuts}>
  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
    {dataStatuts.map((entry, index) => (
      <Cell key={index} fill={getCouleurStatut(entry.statut)} />
    ))}
  </Bar>
</BarChart>
```

### 3. PieChart — RDV par spécialité (donut)
```jsx
// Données : [{ name: "Cardiologie", value: 15 }, ...]
<PieChart>
  <Pie data={stats.rdvParSpecialite} dataKey="value" nameKey="name"
       outerRadius={90} innerRadius={40}>
    {stats.rdvParSpecialite.map((_, i) => (
      <Cell key={i} fill={COLORS[i % COLORS.length]} />
    ))}
  </Pie>
  <Legend />
</PieChart>
```

---

##  Pagination

Composant `Pagination.jsx` réutilisable connecté à la pagination backend :

```jsx
const [page, setPage] = useState(0)

const { data } = useQuery({
  queryKey: ['mes-rdv', page],
  queryFn: () => rdvApi.getMesRdv(page, 10),
  keepPreviousData: true, // garde les données pendant le chargement
})

<Pagination
  page={pageData.page}
  totalPages={pageData.totalPages}
  totalElements={pageData.totalElements}
  size={10}
  onPageChange={setPage}
/>
```

---

##  Prérequis

- Node.js 18+
- ClinicCam Backend démarré sur `http://localhost:8081`

---

##  Installation

```bash
git clone https://github.com/Mori-yim/cliniccam-frontend.git
cd cliniccam-frontend
npm install
npm run dev
# → http://localhost:5174
```

---

##  Variables d'environnement

```env
# .env.local
VITE_API_URL=https://votre-cliniccam-api.railway.app/api/v1
```

---

##  Structure du projet

```
cliniccam-frontend/
├── src/
│   ├── main.jsx
│   ├── App.jsx               ← Routes + ProtectedRoute (roles=[])
│   ├── context/
│   │   └── AuthContext.jsx   ← isAdmin, isMedecin, isPatient
│   ├── services/
│   │   └── api.js            ← authApi, medecinApi, rdvApi, adminApi
│   ├── components/
│   │   ├── Navbar.jsx        ← Navigation adaptative 3 rôles
│   │   ├── MedecinCard.jsx   ← Carte médecin (photo, spécialité, tarif)
│   │   ├── RdvCard.jsx       ← Carte RDV (statut, notes, ordonnance)
│   │   └── ui/
│   │       ├── LoadingSpinner.jsx
│   │       ├── StatCard.jsx   ← KPI card pour le dashboard
│   │       ├── Badge.jsx      ← Badge statut coloré
│   │       └── Pagination.jsx ← Pagination universelle
│   └── pages/
│       ├── HomePage.jsx
│       ├── MedecinsPage.jsx   ← Filtre spécialité + recherche
│       ├── MedecinDetailPage.jsx
│       ├── LoginPage.jsx      ← Redirect selon rôle
│       ├── RegisterPage.jsx
│       ├── PrendreRdvPage.jsx ← Grille créneaux cliquables
│       ├── MesRdvPage.jsx     ← Liste paginée
│       ├── AgendaMedecinPage.jsx ← Vue semaine + modal
│       └── DashboardPage.jsx  ← LineChart + BarChart + PieChart
├── vite.config.js             ← Proxy dev port 5174 → 8081
├── tailwind.config.js
├── vercel.json
└── package.json
```

---

##  Comptes de démonstration

| Rôle | Email | Mot de passe | Redirection |
|------|-------|-------------|-------------|
|  ADMIN | admin@cliniccam.cm | Admin123! | `/dashboard` |
|  MEDECIN | dr.mbarga@cliniccam.cm | Medecin123! | `/agenda` |
|  PATIENT | alain.talla@gmail.com | Patient123! | `/medecins` |

---

##  Déploiement Vercel

```bash
# Variable d'environnement sur Vercel :
VITE_API_URL=https://cliniccam-api.railway.app/api/v1

# Build : npm run build | Output : dist/
# vercel.json gère le routing React Router
```

---

##  Auteur

**Mori (YIMFACK MORINO)**
-  Licence DAP — Université de Douala
-  GitHub : [@Mori-yim](https://github.com/Mori-yim)
