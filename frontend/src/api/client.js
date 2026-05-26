import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:8082';
const DEFAULT_API_PORT = '8082';

/** Asegura URL absoluta; sin protocolo axios la trata como path relativo al frontend. */
function normalizeApiUrl(raw) {
  const value = raw?.trim();
  if (!value) return DEFAULT_API_URL;

  let url = value.replace(/\/$/, '');
  if (!/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }

  try {
    const parsed = new URL(url);
    if (!parsed.port && (parsed.protocol === 'http:' || parsed.protocol === 'https:')) {
      parsed.port = DEFAULT_API_PORT;
    }
    return parsed.origin;
  } catch {
    console.warn('[api] VITE_API_URL inválida, usando default:', raw);
    return DEFAULT_API_URL;
  }
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL);

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
