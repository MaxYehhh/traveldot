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
    isAddingMode: boolean
    activeMemory: Memory | null

    setMapState: (state: Partial<MapState>) => void
    setSelectedPlace: (place: Place | null) => void
    setAddingMode: (isAdding: boolean) => void
    setActiveMemory: (memory: Memory | null) => void
}

export const useMapStore = create<MapState>((set) => ({
    // Default to Bangkok as a central starting point for SE Asia travel context or user's requested context
    currentLocation: { lat: 13.7563, lng: 100.5018 },
    zoom: 12,
    selectedPlace: null,
    isAddingMode: false,
    activeMemory: null,

    setMapState: (state) => set((prev) => ({ ...prev, ...state })),
    setSelectedPlace: (place) => set({ selectedPlace: place }),
    setAddingMode: (isAdding) => set({ isAddingMode: isAdding }),
    setActiveMemory: (memory) => set({ activeMemory: memory }),
}))
