import { create } from 'zustand';
import { TripData, getTrips, createTrip } from '@/services/firestore';
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

    setCurrentTrip: (trip) => set({ currentTrip: trip }),
}));
