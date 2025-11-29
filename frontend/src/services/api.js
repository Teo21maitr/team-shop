/**
 * API Service for TeamShop backend communication.
 * Following SOLID principles - centralized API logic.
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const listApi = {
  /**
   * Créer une nouvelle liste de courses
   */
  createList: async () => {
    const response = await api.post('/lists/');
    return response.data;
  },

  /**
   * Récupérer une liste par son ID
   */
  getList: async (listId) => {
    const response = await api.get(`/lists/${listId}/`);
    return response.data;
  },

  /**
   * Réinitialiser une liste après les courses
   */
  resetList: async (listId) => {
    const response = await api.post(`/lists/${listId}/reset/`);
    return response.data;
  },
};

export const itemApi = {
  /**
   * Ajouter un article à une liste
   */
  addItem: async (listId, name) => {
    const response = await api.post(`/lists/${listId}/items/`, { name });
    return response.data;
  },

  /**
   * Mettre à jour un article
   */
  updateItem: async (itemId, data) => {
    const response = await api.patch(`/items/${itemId}/`, data);
    return response.data;
  },

  /**
   * Supprimer un article
   */
  deleteItem: async (itemId, currentPseudo) => {
    const response = await api.delete(`/items/${itemId}/delete/`, {
      data: { current_pseudo: currentPseudo },
    });
    return response.data;
  },
};
