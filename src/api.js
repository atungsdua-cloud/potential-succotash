import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function login(username, password) {
  const { data } = await api.post('/auth/login', { username, password });
  localStorage.setItem('admin_token', data.token);
  localStorage.setItem('admin_user', JSON.stringify(data.user));
  return data;
}

export function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('admin_user');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function getStoredToken() {
  return localStorage.getItem('admin_token');
}

async function checkAuth() {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch {
    logout();
    return null;
  }
}

export { checkAuth };

export async function fetchMobil() {
  const { data } = await api.get('/mobil');
  return data.map(m => ({ ...m, warna: tryParse(m.warna), fitur: tryParse(m.fitur), tipe: tryParse(m.tipe) }));
}

export async function fetchPromo() { const { data } = await api.get('/promo'); return data; }
export async function fetchTestimoni() { const { data } = await api.get('/testimoni'); return data; }
export async function fetchBerita() { const { data } = await api.get('/berita'); return data; }
export async function fetchGallery() { const { data } = await api.get('/gallery'); return data; }
export async function fetchKeunggulan() { const { data } = await api.get('/keunggulan'); return data; }

export async function fetchSettings() {
  const { data } = await api.get('/settings');
  return data;
}

export async function updateSetting(key, value) {
  const { data } = await api.put(`/settings/${key}`, { value });
  return data;
}

export async function updateItem(table, id, payload) {
  const { data } = await api.put(`/${table}/${id}`, payload);
  return data;
}

export async function createItem(table, payload) {
  const { data } = await api.post(`/${table}`, payload);
  return data;
}

export async function deleteItem(table, id) {
  const { data } = await api.delete(`/${table}/${id}`);
  return data;
}

function tryParse(val) {
  if (!val) return [];
  try { return JSON.parse(val); } catch { return val; }
}

export default api;
