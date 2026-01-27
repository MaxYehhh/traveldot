import { render } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MapMarkers } from '../MapMarkers'
import { useMapStore } from '@/hooks/useMapStore'

vi.mock('@vis.gl/react-google-maps', () => ({
    useMap: vi.fn(),
    AdvancedMarker: ({ title, children }: any) => <div data-testid="marker" title={title}>{children}</div>,
    Pin: ({ background }: any) => <div data-testid="pin" style={{ backgroundColor: background }}>Pin</div>
}))

vi.mock('@googlemaps/markerclusterer', () => ({
    MarkerClusterer: vi.fn().mockImplementation(() => ({
        clearMarkers: vi.fn(),
        addMarkers: vi.fn()
    }))
}))

vi.mock('@/hooks/useMapStore', () => ({
    useMapStore: vi.fn(() => ({
        selectedPlace: null
    }))
}))

describe('components/features/map', () => {
    describe('【前端元素】MapMarkers 標記渲染驗證', () => {
        it('MapMarkers 標記渲染驗證', () => {
            const { getAllByTestId } = render(<MapMarkers />)
            const markers = getAllByTestId('marker')
            // Static places in component are 3
            expect(markers.length).toBe(3)
        })
    })

    describe('【前端元素】MapMarkers 選定地點標記顏色驗證', () => {
        it('MapMarkers 選定地點標記顏色驗證', () => {
            // Use vi.mocked to set the return value for this specific test
            vi.mocked(useMapStore).mockReturnValue({
                selectedPlace: { id: 's1', name: 'Selected', location: { lat: 0, lng: 0 } },
                setMapState: vi.fn(),
                setSelectedPlace: vi.fn(),
                isAddingMode: false,
                setAddingMode: vi.fn(),
                currentLocation: { lat: 0, lng: 0 },
                zoom: 12
            })

            const { getAllByTestId } = render(<MapMarkers />)
            const pins = getAllByTestId('pin')
            // 3 static + 1 selected
            expect(pins.length).toBe(4)

            // Check for yellow pin (#FBBC04)
            const yellowPin = pins.find(p => (p as HTMLElement).style.backgroundColor === 'rgb(251, 188, 4)')
            expect(yellowPin).toBeDefined()
        })
    })
})
