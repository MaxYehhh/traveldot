import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Google Maps API
global.google = {
    maps: {
        places: {
            AutocompleteService: vi.fn(),
            AutocompleteSessionToken: vi.fn(),
            PlacesService: vi.fn(),
            PlacesServiceStatus: {
                OK: 'OK',
            },
        },
        importLibrary: vi.fn(),
    },
} as any
