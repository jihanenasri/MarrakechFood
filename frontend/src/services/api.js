import axios from 'axios';

const API_CONFIG = {
  client: 'https://marrakechfood-production.up.railway.app',
  restaurant: 'https://handsome-gratitude-production-9e23.up.railway.app',
  commande: 'https://loving-dedication-production-6a00.up.railway.app',
  livreur: 'https://marrakechfood-production-22c2.up.railway.app'
};

export const clientAPI = {
  login: (data) => axios.post(`${API_CONFIG.client}/api/clients/connexion`, data),
  register: (data) => axios.post(`${API_CONFIG.client}/api/clients/inscrire`, data),
  getById: (id) => axios.get(`${API_CONFIG.client}/api/clients/${id}`)
};

export const restaurantAPI = {
  getAll: () => axios.get(`${API_CONFIG.restaurant}/api/restaurants`),
  getById: (id) => axios.get(`${API_CONFIG.restaurant}/api/restaurants/${id}`),
  getPlats: (restaurantId) => axios.get(`${API_CONFIG.restaurant}/api/restaurants/${restaurantId}/plats`),
  create: (data) => axios.post(`${API_CONFIG.restaurant}/api/restaurants`, data),
  update: (id, data) => axios.put(`${API_CONFIG.restaurant}/api/restaurants/${id}`, data),
  delete: (id) => axios.delete(`${API_CONFIG.restaurant}/api/restaurants/${id}`),
  getPlatById: (id) => axios.get(`${API_CONFIG.restaurant}/api/restaurants/plats/${id}`),
  createPlat: (restaurantId, data) => axios.post(`${API_CONFIG.restaurant}/api/restaurants/${restaurantId}/plats`, data),
  updatePlat: (id, data) => axios.put(`${API_CONFIG.restaurant}/api/restaurants/plats/${id}`, data),
  deletePlat: (id) => axios.delete(`${API_CONFIG.restaurant}/api/restaurants/plats/${id}`)
};

export const commandeAPI = {
  create: (data) => axios.post(`${API_CONFIG.commande}/api/commandes`, data),
  getByClient: (clientId) => axios.get(`${API_CONFIG.commande}/api/commandes/client/${clientId}`),
  getById: (id) => axios.get(`${API_CONFIG.commande}/api/commandes/${id}`),
  valider: (id) => axios.put(`${API_CONFIG.commande}/api/commandes/${id}/valider`),
  getByStatut: (statut) => axios.get(`${API_CONFIG.commande}/api/commandes/statut/${statut}`)
};

export const livreurAPI = {
  getDisponibles: () => axios.get(`${API_CONFIG.livreur}/api/livreurs/disponibles`),
  assignerLivreur: (commandeId) => axios.put(`${API_CONFIG.livreur}/api/livreurs/assigner/${commandeId}`),
  scanQR: (qrData) => axios.post(
    `${API_CONFIG.livreur}/api/livreurs/scan-qr`,
    qrData.trim(),
    { headers: { "Content-Type": "text/plain" } }
  )
};

export default {
  clientAPI,
  restaurantAPI,
  commandeAPI,
  livreurAPI
};