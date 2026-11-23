import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api'
});

// Intercepteur : exécuté avant CHAQUE requête envoyée par api
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');       // lit le jeton sauvegardé dans le navigateur
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // l'ajoute à l'en-tête de la requête
  }
  return config;                                      // obligatoire : renvoie la requête modifiée
});

export default api;