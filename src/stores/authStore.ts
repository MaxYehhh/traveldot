import { create } from 'zustand';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import { signIn, signUp, signOut, resetPassword } from '../services/auth';

interface AuthState {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    setCurrentUser: (user: User | null) => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    currentUser: null,
    loading: true, // Initial loading state for auth check
    error: null,
    isInitialized: false,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await signIn(email, password);
            // currentUser will be updated by onAuthStateChanged listener
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    signup: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await signUp(email, password);
            // currentUser will be updated by onAuthStateChanged listener
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        set({ loading: true, error: null });
        try {
            await signOut();
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    resetPassword: async (email) => {
        set({ loading: true, error: null });
        try {
            await resetPassword(email);
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    setCurrentUser: (user) => set({ currentUser: user, loading: false, isInitialized: true }),
    clearError: () => set({ error: null }),
}));

// Initialize Auth Listener
onAuthStateChanged(auth, (user) => {
    useAuthStore.getState().setCurrentUser(user);
});
