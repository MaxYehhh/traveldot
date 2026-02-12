import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MapMarkers } from '../MapMarkers'
import { useMapStore } from '@/stores/mapStore'

vi.mock('@vis.gl/react-google-maps', () => ({
    useMap: vi.fn(),
    AdvancedMarker: ({ title, children, className }: any) => <div data-testid="marker" title={title} className={className}>{children}</div>,
    Pin: ({ background }: any) => <div data-testid="pin" style={{ backgroundColor: background }}>Pin</div>
}))

vi.mock('@googlemaps/markerclusterer', () => ({
    MarkerClusterer: vi.fn().mockImplementation(() => ({
        clearMarkers: vi.fn(),
        addMarkers: vi.fn()
    }))
}))

vi.mock('@/stores/mapStore', () => ({
    useMapStore: vi.fn(() => ({
        selectedPlace: null,
        places: []
    }))
}))

describe('components/features/map', () => {
    describe('【前端元素】MapMarkers 標記渲染驗證', () => {
        it('MapMarkers 標記渲染驗證', () => {
            // Need to mock Places in store
            vi.mocked(useMapStore).mockReturnValue({
                selectedPlace: null,
                // @ts-ignore
                places: [
                    { id: '1', name: 'P1', location: { lat: 0, lng: 0 } },
                    { id: '2', name: 'P2', location: { lat: 0, lng: 0 } },
                    { id: '3', name: 'P3', location: { lat: 0, lng: 0 } }
                ],
                setMapState: vi.fn(),
                setSelectedPlace: vi.fn(),
                isAddingMode: false,
                setAddingMode: vi.fn(),
                currentLocation: { lat: 0, lng: 0 },
                zoom: 12,
                activeMemory: null,
                setActiveMemory: vi.fn(),
                setPlaces: vi.fn()
            })

            const { getAllByTestId } = render(<MapMarkers />)
            const markers = getAllByTestId('marker')
            expect(markers.length).toBe(3)
        })
    })

    describe('【前端元素】MapMarkers 選定地點標記顏色驗證', () => {
        it('MapMarkers 選定地點標記顏色驗證', () => {
            vi.mocked(useMapStore).mockReturnValue({
                selectedPlace: { id: 's1', name: 'Selected', location: { lat: 0, lng: 0 } },
                // @ts-ignore
                places: [
                    { id: '1', name: 'P1', location: { lat: 0, lng: 0 } },
                    { id: '2', name: 'P2', location: { lat: 0, lng: 0 } },
                    { id: '3', name: 'P3', location: { lat: 0, lng: 0 } }
                ],
                setMapState: vi.fn(),
                setSelectedPlace: vi.fn(),
                isAddingMode: false,
                setAddingMode: vi.fn(),
                currentLocation: { lat: 0, lng: 0 },
                zoom: 12,
                activeMemory: null,
                setActiveMemory: vi.fn(),
                setPlaces: vi.fn()
            })

            const { getAllByTestId } = render(<MapMarkers />)
            const pins = getAllByTestId('pin')
            // 3 places + 1 selected = 4
            expect(pins.length).toBe(4)

            // Check for yellow pin (#FBBC04)
            const yellowPin = pins.find(p => (p as HTMLElement).style.backgroundColor === 'rgb(251, 188, 4)')
            expect(yellowPin).toBeDefined()
        })
    })
})
