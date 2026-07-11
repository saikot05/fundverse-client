import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiry / unauthenticated states
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // optional redirect if needed
    }
    return Promise.reject(error);
  }
);

// Auth Services
export const authService = {
  register: async (data: any) => {
    const res = await api.post('/auth/register', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  login: async (data: any) => {
    const res = await api.post('/auth/login', data);
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Campaign Services
export const campaignService = {
  create: async (data: any) => {
    const res = await api.post('/campaigns', data);
    return res.data;
  },
  getAll: async (params: { page?: number; limit?: number; search?: string; category?: string; sort?: string; status?: string }) => {
    const res = await api.get('/campaigns', { params });
    return res.data;
  },
  getAdminAll: async () => {
    const res = await api.get('/campaigns/admin/all');
    return res.data;
  },
  getMyCampaigns: async () => {
    const res = await api.get('/campaigns/my-campaigns');
    return res.data;
  },
  getById: async (id: string) => {
    const res = await api.get(`/campaigns/${id}`);
    return res.data;
  },
  update: async (id: string, data: any) => {
    const res = await api.patch(`/campaigns/${id}`, data);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/campaigns/${id}`);
    return res.data;
  },
  approve: async (id: string) => {
    const res = await api.patch(`/campaigns/${id}/approve`);
    return res.data;
  },
  reject: async (id: string) => {
    const res = await api.patch(`/campaigns/${id}/reject`);
    return res.data;
  },
};

// Payment Services
export const paymentService = {
  createPaymentIntent: async (amount: number) => {
    const res = await api.post('/payments/create-payment-intent', { amount });
    return res.data;
  },
  verifyPayment: async (paymentIntentId: string) => {
    const res = await api.post('/payments/verify', { paymentIntentId });
    return res.data;
  },
  getHistory: async () => {
    const res = await api.get('/payments/history');
    return res.data;
  },
};

// Contribution Services
export const contributionService = {
  create: async (campaignId: string, amount: number) => {
    const res = await api.post('/contributions', { campaignId, amount });
    return res.data;
  },
  getByCampaign: async (campaignId: string) => {
    const res = await api.get(`/contributions/campaign/${campaignId}`);
    return res.data;
  },
  getMyContributions: async () => {
    const res = await api.get('/contributions/my-contributions');
    return res.data;
  },
};

// Withdrawal Services
export const withdrawalService = {
  create: async (data: { campaignId: string; amount: number; bankDetails: any }) => {
    const res = await api.post('/withdrawals', data);
    return res.data;
  },
  getMyWithdrawals: async () => {
    const res = await api.get('/withdrawals/my-withdrawals');
    return res.data;
  },
  getAdminAll: async () => {
    const res = await api.get('/withdrawals/admin/all');
    return res.data;
  },
  approve: async (id: string) => {
    const res = await api.patch(`/withdrawals/${id}/approve`);
    return res.data;
  },
  reject: async (id: string) => {
    const res = await api.patch(`/withdrawals/${id}/reject`);
    return res.data;
  },
};

// Notification Services
export const notificationService = {
  getAll: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  readAll: async () => {
    const res = await api.patch('/notifications/read-all');
    return res.data;
  },
  readSingle: async (id: string) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  },
};

// Report Services
export const reportService = {
  create: async (campaignId: string, reason: string) => {
    const res = await api.post('/reports', { campaignId, reason });
    return res.data;
  },
  getAdminAll: async () => {
    const res = await api.get('/reports/admin/all');
    return res.data;
  },
  resolve: async (id: string) => {
    const res = await api.patch(`/reports/${id}/resolve`);
    return res.data;
  },
};

// Stats Services
export const statsService = {
  getCreatorStats: async () => {
    const res = await api.get('/stats/creator');
    return res.data;
  },
  getAdminStats: async () => {
    const res = await api.get('/stats/admin');
    return res.data;
  },
};

// User Admin Services
export const userAdminService = {
  getAll: async () => {
    const res = await api.get('/users/admin/users');
    return res.data;
  },
  updateRole: async (id: string, role: string) => {
    const res = await api.patch(`/users/admin/users/${id}/role`, { role });
    return res.data;
  },
};
