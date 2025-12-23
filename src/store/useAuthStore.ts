import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    full_name: string;
    avatar_url?: string;
    role: string;
    total_points?: number; // Optional until joined
    day_streak?: number;
    title?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;

    // Actions
    login: (user: User, accessToken: string, refreshToken?: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    setAccessToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,

            login: (user, accessToken, refreshToken) => {
                // We might store refreshToken in cookie or localStorage depending on security preference
                // For now, let's keep it simple in localStorage via persist if needed, 
                // OR better: handle refreshToken explicitly.
                // The persist middleware will save everything in state to localStorage by default.
                if (refreshToken) {
                    localStorage.setItem('refreshToken', refreshToken);
                }
                set({ user, accessToken, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('refreshToken');
                set({ user: null, accessToken: null, isAuthenticated: false });
            },

            updateUser: (updates) =>
                set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),

            setAccessToken: (token) => set({ accessToken: token }),
        }),
        {
            name: 'auth-storage', // key in localStorage
            storage: createJSONStorage(() => localStorage),
            // Only persist user and check token validity on hydrate? 
            // Usually we persist everything.
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
            // Note: We deliberately do NOT persist accessToken in zustand store (memory only) for security 
            // if using refresh tokens flow, OR we persist it if we want simple DX.
            // Given: "Problème : Si le token expire, l'utilisateur est déconnecté brutalement."
            // Solution: AccessToken (short) + RefreshToken (long).
            // Best practice: Access Token in Memory (Zustand), Refresh Token in HttpOnly Cookie (or LocalStorage if not strict).
            // Here we will keep accessToken in memory (so refresh on reload).
        }
    )
);
