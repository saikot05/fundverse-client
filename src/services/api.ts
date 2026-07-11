import { authClient } from '../lib/auth-client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Custom fetch wrapper to replace Axios.
 * Automatically handles JWT tokens and error catching.
 */
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Get JWT Token from Better Auth
  if (typeof window !== 'undefined') {
    try {
      const { data } = await authClient.token();
      if (data?.token) {
        headers.set('Authorization', `Bearer ${data.token}`);
      }
    } catch (e) {
      // Ignore token fetch error
    }
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'API request failed');
    }
    
    // Attempt to parse JSON, if it's empty return null
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    // If it's a network error or fetch fails, throw a custom error to be caught safely
    console.error(`[API Fetch Error] ${endpoint}:`, error);
    throw error;
  }
}

// Convert params object to query string
function buildQueryString(params?: Record<string, any>) {
  if (!params) return '';
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

// Auth Services
export const authService = {
  register: async (data: any) => {
    const res = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image || '',
      role: data.role || 'supporter', 
    } as any);

    if (res.error) {
      throw new Error(res.error.message || 'Registration failed.');
    }

    const responseData = res.data as any;
    const userData = {
      id: responseData?.user?.id,
      name: responseData?.user?.name,
      email: responseData?.user?.email,
      role: responseData?.user?.role || 'supporter',
      credits: responseData?.user?.credits || 0,
      image: responseData?.user?.image || undefined,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    return { user: userData };
  },

  login: async (data: any) => {
    const res = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (res.error) {
      throw new Error(res.error.message || 'Login failed.');
    }

    const responseData = res.data as any;
    const userData = {
      id: responseData?.user?.id,
      name: responseData?.user?.name,
      email: responseData?.user?.email,
      role: responseData?.user?.role || 'supporter',
      credits: responseData?.user?.credits || 0,
      image: responseData?.user?.image || undefined,
    };

    localStorage.setItem('user', JSON.stringify(userData));
    return { user: userData };
  },

  getCurrentUser: async () => {
    const res = await authClient.getSession();
    if (res.error || !res.data) {
      throw new Error('Not authenticated.');
    }

    const responseData = res.data as any;
    const userData = {
      id: responseData?.user?.id,
      name: responseData?.user?.name,
      email: responseData?.user?.email,
      role: responseData?.user?.role || 'supporter',
      credits: responseData?.user?.credits || 0,
      image: responseData?.user?.image || undefined,
    };

    return { user: userData };
  },

  logout: async () => {
    const res = await authClient.signOut();
    if (res.error) {
      throw new Error(res.error.message || 'Logout failed.');
    }
    localStorage.removeItem('user');
  },
};

// Campaign Services
export const campaignService = {
  create: async (data: any) => {
    return fetchApi('/campaigns', { method: 'POST', body: JSON.stringify(data) });
  },
  getAll: async (params: { page?: number; limit?: number; search?: string; category?: string; sort?: string; status?: string }) => {
    return fetchApi(`/campaigns${buildQueryString(params)}`, { method: 'GET' });
  },
  getAdminAll: async () => {
    return fetchApi('/campaigns/admin/all', { method: 'GET' });
  },
  getMyCampaigns: async () => {
    return fetchApi('/campaigns/my-campaigns', { method: 'GET' });
  },
  getById: async (id: string) => {
    return fetchApi(`/campaigns/${id}`, { method: 'GET' });
  },
  update: async (id: string, data: any) => {
    return fetchApi(`/campaigns/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    return fetchApi(`/campaigns/${id}`, { method: 'DELETE' });
  },
  approve: async (id: string) => {
    return fetchApi(`/campaigns/${id}/approve`, { method: 'PATCH' });
  },
  reject: async (id: string) => {
    return fetchApi(`/campaigns/${id}/reject`, { method: 'PATCH' });
  },
};

// Payment Services
export const paymentService = {
  createPaymentIntent: async (amount: number) => {
    return fetchApi('/payments/create-payment-intent', { method: 'POST', body: JSON.stringify({ amount }) });
  },
  verifyPayment: async (paymentIntentId: string) => {
    return fetchApi('/payments/verify', { method: 'POST', body: JSON.stringify({ paymentIntentId }) });
  },
  getHistory: async () => {
    return fetchApi('/payments/history', { method: 'GET' });
  },
};

// Contribution Services
export const contributionService = {
  create: async (campaignId: string, amount: number) => {
    return fetchApi('/contributions', { method: 'POST', body: JSON.stringify({ campaignId, amount }) });
  },
  getByCampaign: async (campaignId: string) => {
    return fetchApi(`/contributions/campaign/${campaignId}`, { method: 'GET' });
  },
  getMyContributions: async () => {
    return fetchApi('/contributions/my-contributions', { method: 'GET' });
  },
};

// Withdrawal Services
export const withdrawalService = {
  create: async (data: { campaignId: string; amount: number; bankDetails: any }) => {
    return fetchApi('/withdrawals', { method: 'POST', body: JSON.stringify(data) });
  },
  getMyWithdrawals: async () => {
    return fetchApi('/withdrawals/my-withdrawals', { method: 'GET' });
  },
  getAdminAll: async () => {
    return fetchApi('/withdrawals/admin/all', { method: 'GET' });
  },
  approve: async (id: string) => {
    return fetchApi(`/withdrawals/${id}/approve`, { method: 'PATCH' });
  },
  reject: async (id: string) => {
    return fetchApi(`/withdrawals/${id}/reject`, { method: 'PATCH' });
  },
};

// Notification Services
export const notificationService = {
  getAll: async () => {
    return fetchApi('/notifications', { method: 'GET' });
  },
  readAll: async () => {
    return fetchApi('/notifications/read-all', { method: 'PATCH' });
  },
  readSingle: async (id: string) => {
    return fetchApi(`/notifications/${id}/read`, { method: 'PATCH' });
  },
};

// Report Services
export const reportService = {
  create: async (campaignId: string, reason: string) => {
    return fetchApi('/reports', { method: 'POST', body: JSON.stringify({ campaignId, reason }) });
  },
  getAdminAll: async () => {
    return fetchApi('/reports/admin/all', { method: 'GET' });
  },
  resolve: async (id: string) => {
    return fetchApi(`/reports/${id}/resolve`, { method: 'PATCH' });
  },
};

// Stats Services
export const statsService = {
  getCreatorStats: async () => {
    return fetchApi('/stats/creator', { method: 'GET' });
  },
  getAdminStats: async () => {
    return fetchApi('/stats/admin', { method: 'GET' });
  },
};

// User Admin Services
export const userAdminService = {
  getAll: async () => {
    return fetchApi('/users/admin/users', { method: 'GET' });
  },
  updateRole: async (id: string, role: string) => {
    return fetchApi(`/users/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
  },
};
