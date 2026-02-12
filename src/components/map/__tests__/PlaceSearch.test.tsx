import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PlaceSearch } from '../PlaceSearch'

// Stable mocks to prevent useEffect infinity
const mockSetSelectedPlace = vi.fn()
const mockSetMapState = vi.fn()

vi.mock('@/stores/mapStore', () => ({
    useMapStore: vi.fn(() => ({
        setSelectedPlace: mockSetSelectedPlace,
        setMapState: mockSetMapState
    }))
}))

const mockAutocompleteService = {
    getPlacePredictions: vi.fn((_req, cb) => cb([{
        place_id: 'p1',
        structured_formatting: { main_text: 'Bangkok', secondary_text: 'Thailand' }
    }], 'OK'))
}

const mockPlacesService = {
    getDetails: vi.fn((_req, cb) => cb({
        place_id: 'p1',
        name: 'Bangkok',
        geometry: { location: { lat: () => 13.7, lng: () => 100.5 } },
        formatted_address: 'Bangkok, Thailand'
    }, 'OK'))
}

const mockLib = {
    AutocompleteService: vi.fn(() => mockAutocompleteService),
    AutocompleteSessionToken: vi.fn(() => ({})),
    PlacesService: vi.fn(() => mockPlacesService),
    PlacesServiceStatus: { OK: 'OK' }
}

vi.mock('@vis.gl/react-google-maps', () => ({
    useMap: vi.fn(() => ({
        panTo: vi.fn(),
        setZoom: vi.fn()
    })),
    useMapsLibrary: vi.fn(() => mockLib)
}))

describe('components/features/map', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('【Mock API】PlaceSearch 搜尋功能驗證', () => {
        it('PlaceSearch 搜尋功能驗證', async () => {
            render(<PlaceSearch />)
            const input = screen.getByPlaceholderText('搜尋地點或標記...')

            fireEvent.change(input, { target: { value: 'Bangkok' } })

            const result = await screen.findByText('Bangkok')
            expect(result).toBeInTheDocument()
        })
    })

    describe('【function 邏輯】PlaceSearch 選取地點驗證', () => {
        it('PlaceSearch 選取地點驗證', async () => {
            render(<PlaceSearch />)
            const input = screen.getByPlaceholderText('搜尋地點或標記...')

            fireEvent.change(input, { target: { value: 'Bangkok' } })

            const result = await screen.findByText('Bangkok')
            fireEvent.click(result)

            await waitFor(() => {
                expect(mockSetMapState).toHaveBeenCalled()
                expect(mockSetSelectedPlace).toHaveBeenCalled()
            })
        })
    })
})
