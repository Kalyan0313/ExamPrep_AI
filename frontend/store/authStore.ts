import { create } from 'zustand';

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  currentStreak: number;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: UserProfile, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('examprep_token', token);
      localStorage.setItem('examprep_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('examprep_token');
      localStorage.removeItem('examprep_user');
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('examprep_token');
      const userStr = localStorage.getItem('examprep_user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true, isLoading: false });
          return;
        } catch (e) {
          console.error('Failed to parse cached user token');
        }
      }
    }
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
