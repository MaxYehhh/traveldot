import { create } from 'zustand'

export interface Location {
    lat: number
    lng: number
}

export interface Place {
    id: string
    name: string
    location: Location
    address?: string
    photos?: string[]
    color?: string
    // Phase 2 fields
    rating?: number
    tags?: string[]
    visitedDate?: string
    content?: string
}

export interface Memory {
    text: string
    photos: string[]
    tags: string[]
    visitedDate: string
}

interface MapState {
    currentLocation: Location
    zoom: number
    selectedPlace: Place | null
    activeMemory: Memory | null
    places: Place[]

    mapCenter: Location
    // Phase 2 UI State
    isSidebarOpen: boolean
    isEditorOpen: boolean
    editorMode: 'add' | 'edit'
    editorLayoutMode: 'popup' | 'panel'
}

interface MapActions {
    setMapState: (state: Partial<MapState>) => void
    setMapCenter: (center: Location) => void
    setSelectedPlace: (place: Place | null) => void
    setActiveMemory: (memory: Memory | null) => void
    setPlaces: (places: Place[]) => void
    deletePlace: (id: string) => void

    // Phase 2 UI Actions
    toggleSidebar: () => void
    setSidebarOpen: (isOpen: boolean) => void
    openEditor: (mode: 'add' | 'edit') => void
    closeEditor: () => void
    setEditorLayoutMode: (mode: 'popup' | 'panel') => void
}

const DEFAULT_CENTER = { lat: 13.7563, lng: 100.5018 };
const DEFAULT_ZOOM = 12;

export const useMapStore = create<MapState & MapActions>((set) => ({
    // Default to Bangkok
    currentLocation: DEFAULT_CENTER,
    mapCenter: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    selectedPlace: null,
    activeMemory: null,
    places: [],

    // Phase 2 defaults
    isSidebarOpen: true, // Default open for desktop
    isEditorOpen: false,
    editorMode: 'add',
    editorLayoutMode: 'popup',

    setMapState: (state) => set((s) => ({ ...s, ...state })),
    setMapCenter: (center) => set(() => ({ mapCenter: center })),
    setSelectedPlace: (place) => set(() => ({ selectedPlace: place })),
    setActiveMemory: (memory) => set({ activeMemory: memory }),
    setPlaces: (places) => set({ places }),

    deletePlace: (id) => set((state) => {
        // Optimistic update or just wait for Firebase?
        // Since MapDataManager handles subscription, we technically don't need to delete locally if we trust the speed.
        // BUT, for responsiveness, we can keep this.
        // However, MapDataManager will overwrite it anyway.
        const newPlaces = state.places.filter(p => p.id !== id)
        const newSelectedPlace = state.selectedPlace?.id === id ? null : state.selectedPlace
        return { places: newPlaces, selectedPlace: newSelectedPlace }
    }),

    // Phase 2 implementations
    toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
    setSidebarOpen: (isOpen) => set(() => ({ isSidebarOpen: isOpen })),
    openEditor: (mode) => set(() => ({ isEditorOpen: true, editorMode: mode })),
    closeEditor: () => set(() => ({ isEditorOpen: false })),
    setEditorLayoutMode: (mode) => set(() => ({ editorLayoutMode: mode })),
}))
