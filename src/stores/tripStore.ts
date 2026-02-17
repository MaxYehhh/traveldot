import { create } from 'zustand';
import { TripData, getTrips, createTrip, updateTrip as firestoreUpdateTrip, deleteTrip as firestoreDeleteTrip } from '@/services/firestore';
import { useAuthStore } from './authStore';

interface TripState {
    trips: TripData[];
    currentTrip: TripData | null;
    loading: boolean;
    error: string | null;
}

interface TripActions {
    fetchTrips: () => Promise<void>;
    createTrip: (title: string, startDate: Date, endDate: Date) => Promise<void>;
    updateTrip: (tripId: string, updates: Partial<TripData>) => Promise<void>;
    deleteTrip: (tripId: string) => Promise<void>;
    setCurrentTrip: (trip: TripData | null) => void;
}

export const useTripStore = create<TripState & TripActions>((set, get) => ({
    trips: [],
    currentTrip: null,
    loading: false,
    error: null,

    fetchTrips: async () => {
        const user = useAuthStore.getState().currentUser;
        if (!user) return;

        set({ loading: true, error: null });
        try {
            const trips = await getTrips(user.uid);
            set({ trips });
            // Optionally select the first trip if none selected
            if (!get().currentTrip && trips.length > 0) {
                set({ currentTrip: trips[0] });
            }
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    createTrip: async (title, startDate, endDate) => {
        const user = useAuthStore.getState().currentUser;
        if (!user) return;

        set({ loading: true, error: null });
        try {
            await createTrip(user.uid, {
                title,
                description: '',
                startDate,
                endDate,
                coverImage: null
            });
            await get().fetchTrips();
        } catch (error: any) {
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },

    updateTrip: async (tripId, updates) => {
        const user = useAuthStore.getState().currentUser;
        if (!user) return;

        set({ loading: true, error: null });
        try {
            await firestoreUpdateTrip(user.uid, tripId, updates);
            await get().fetchTrips();
            // If the updated trip is currently selected, also update currentTrip in-place
            const currentTrip = get().currentTrip;
            if (currentTrip?.id === tripId) {
                const refreshed = get().trips.find(t => t.id === tripId) ?? null;
                set({ currentTrip: refreshed });
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    deleteTrip: async (tripId) => {
        const user = useAuthStore.getState().currentUser;
        if (!user) return;

        set({ loading: true, error: null });
        try {
            await firestoreDeleteTrip(user.uid, tripId);
            await get().fetchTrips();
            // If deleted trip was the current trip, switch to first remaining or null
            const currentTrip = get().currentTrip;
            if (currentTrip?.id === tripId) {
                const remaining = get().trips;
                set({ currentTrip: remaining.length > 0 ? remaining[0] : null });
            }
        } catch (error: any) {
            set({ error: error.message });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    setCurrentTrip: (trip) => set({ currentTrip: trip }),
}));
