import { create } from 'zustand';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'client';
}

interface Business {
  id: string;
  name: string;
  slug: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  business: Business | null;
  token: string | null;
  isLoading: boolean;

  loginOwner: (data: RegisterOwnerData) => Promise<void>;
  loginClient: (data: RegisterClientData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

interface RegisterOwnerData {
  name: string;
  email: string;
  password: string;
  businessName: string;
  businessSlug: string;
}

interface RegisterClientData {
  name: string;
  email: string;
  password: string;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  business: null,
  token: localStorage.getItem('token'),
  isLoading: false,

  loginOwner: async (data) => {
    const res = await api.post('/auth/register/owner', data);
    const { token, user, business } = res.data;
    localStorage.setItem('token', token);
    set({ token, user, business });
  },

  loginClient: async (data) => {
    const res = await api.post('/auth/register/client', data);
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    set({ token, user, business: null });
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user, business } = res.data;
    localStorage.setItem('token', token);
    set({ token, user, business: business ?? null });
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, business: null, token: null });
  },

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/auth/me');
      set({
        user: res.data.user,
        business: res.data.business ?? null,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, business: null, token: null, isLoading: false });
    }
  },
}));
