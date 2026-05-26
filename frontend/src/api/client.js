import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8082';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const peliculasApi = {
  listar: () => client.get('/peliculas'),
  obtener: (id) => client.get(`/peliculas/${id}`),
  crear: (data) => client.post('/peliculas', data),
  actualizar: (id, data) => client.put(`/peliculas/${id}`, data),
  eliminar: (id) => client.delete(`/peliculas/${id}`),
};

export default client;
