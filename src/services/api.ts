const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error! status: ${response.status}` }));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.warn(`API endpoint ${endpoint} is not available (backend may be offline)`);
    } else {
      console.error('API Error:', error);
    }
    throw error;
  }
}

export const usersAPI = {
  register: (userData: { name: string; email: string; password: string }) => fetchAPI('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials: { email: string; password: string }) => fetchAPI('/users/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getUser: (id: string) => fetchAPI(`/users/${id}`),
  updateUser: (id: string, userData: any) => fetchAPI(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  }),
  changePassword: (id: string, passwords: { currentPassword: string; newPassword: string }) => fetchAPI(`/users/${id}/change-password`, {
    method: 'PATCH',
    body: JSON.stringify(passwords),
  }),
  createOrder: (id: string, orderData: { items: any[]; delivery: number }) => fetchAPI(`/users/${id}/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  clearOrders: (id: string) => fetchAPI(`/users/${id}/orders`, {
    method: 'DELETE',
  }),
  getAllUsers: () => fetchAPI('/users/all'),
  resetUserPassword: (id: string, newPassword: string) => fetchAPI(`/users/${id}/reset-password`, {
    method: 'PATCH',
    body: JSON.stringify({ newPassword }),
  }),
  updateUserRole: (id: string, role: string) => fetchAPI(`/users/${id}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  }),
};

export const productsAPI = {
  getAll: () => fetchAPI('/products'),
  getByCategory: (category: string) => fetchAPI(`/products/${category}`),
  updateAll: (data: any) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const faqAPI = {
  getAll: () => fetchAPI('/faq'),
  getById: (id: string) => fetchAPI(`/faq/${id}`),
};

export const blogAPI = {
  getAll: () => fetchAPI('/blog'),
  getById: (id: string) => fetchAPI(`/blog/${id}`),
};

export const heroAPI = {
  getAll: () => fetchAPI('/hero'),
  getById: (id: string) => fetchAPI(`/hero/${id}`),
};

export const catalogAPI = {
  getAll: () => fetchAPI('/catalog'),
  getById: (id: string) => fetchAPI(`/catalog/${id}`),
  getByCategory: (category: string) => fetchAPI(`/catalog/category/${category}`),
};

export default {
  users: usersAPI,
  products: productsAPI,
  faq: faqAPI,
  blog: blogAPI,
  hero: heroAPI,
  catalog: catalogAPI,
};
