const API_BASE = 'http://localhost:4001/api';

function authHeaders(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(token),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error((data && data.error) || 'Request failed');
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  getTasks: (token) => request('/tasks', { token }),
  createTask: (token, payload) => request('/tasks', { method: 'POST', token, body: payload }),
  updateTask: (token, id, payload) => request(`/tasks/${id}`, { method: 'PUT', token, body: payload }),
  deleteTask: (token, id) => request(`/tasks/${id}`, { method: 'DELETE', token }),
  getNotes: (token) => request('/notes', { token }),
  createNote: (token, payload) => request('/notes', { method: 'POST', token, body: payload }),
  updateNote: (token, id, payload) => request(`/notes/${id}`, { method: 'PUT', token, body: payload }),
  deleteNote: (token, id) => request(`/notes/${id}`, { method: 'DELETE', token }),
};
