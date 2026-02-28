const API_URL = '/api';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('userId');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': token } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => request('/login', { method: 'POST', body: JSON.stringify(credentials) }),
    me: () => request('/me'),
  },
  inventory: {
    getAll: () => request('/inventory'),
    create: (data: any) => request('/inventory', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: any) => request(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/inventory/${id}`, { method: 'DELETE' }),
  },
  brands: {
    getAll: () => request('/brands'),
    create: (data: any) => request('/brands', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/brands/${id}`, { method: 'DELETE' }),
  },
  attributes: {
    getAll: () => request('/attributes'),
    create: (data: any) => request('/attributes', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: number) => request(`/attributes/${id}`, { method: 'DELETE' }),
  },
  dashboard: {
    getStats: () => request('/dashboard/stats'),
  }
};
