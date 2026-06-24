// src/services/api.js
import axios from 'axios'

/**
 * ================================================================
 * CLIENT HTTP AXIOS — CLINICCAM
 * ================================================================
 * Instance Axios avec :
 *   - URL de base de l'API Spring Boot
 *   - Injection automatique du token JWT dans chaque requête
 *   - Déconnexion automatique si token expiré (401)
 * ================================================================
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
})

// Injecter le token JWT à chaque requête
api.interceptors.request.use(config => {
  const token = localStorage.getItem('cliniccam_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Gérer les erreurs globalement
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cliniccam_token')
      localStorage.removeItem('cliniccam_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ============================================================
// API ORGANISÉE PAR DOMAINE
// ============================================================

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
}

export const medecinApi = {
  /** Liste tous les médecins, avec filtre optionnel par spécialité */
  getAll: (specialite) => api.get('/medecins', { params: specialite ? { specialite } : {} }),
  getById: (id) => api.get(`/medecins/${id}`),
  update: (id, data) => api.put(`/medecins/${id}`, data),
  /** Agenda d'un médecin : ?debut=2024-12-01&fin=2024-12-31 */
  getAgenda: (id, debut, fin) => api.get(`/medecins/${id}/agenda`, { params: { debut, fin } }),
  getRdvDuJour: (id) => api.get(`/medecins/${id}/rdv-du-jour`),
}

export const rdvApi = {
  /** Prendre un rendez-vous */
  creer: (data) => api.post('/rendez-vous', data),
  /** Mes rendez-vous paginés : ?page=0&size=10 */
  getMesRdv: (page = 0, size = 10) => api.get('/rendez-vous/mes-rdv', { params: { page, size } }),
  /** Mettre à jour un RDV (médecin/admin) */
  update: (id, data) => api.put(`/rendez-vous/${id}`, data),
  /** Annuler un RDV (patient) */
  annuler: (id, raison) => api.put(`/rendez-vous/${id}/annuler`, null, { params: { raison } }),
}

export const adminApi = {
  /** Statistiques du dashboard */
  getStats: () => api.get('/dashboard/stats'),
  /** Liste paginée des patients */
  getPatients: (page = 0, size = 10, search = '') =>
    api.get('/admin/patients', { params: { page, size, search } }),
  /** Tous les RDV */
  getAllRdv: (page = 0, size = 10) => api.get('/admin/rendez-vous', { params: { page, size } }),
}

export const specialiteApi = {
  getAll: () => api.get('/specialites'),
}
