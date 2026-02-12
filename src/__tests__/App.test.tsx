import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../App'

vi.mock('@/components/map/MapContainer', () => ({
    MapContainer: () => <div data-testid="map-container">MapContainer</div>
}))

describe('App', () => {
    describe('【前端元素】App 組件渲染驗證', () => {
        it('App 組件渲染驗證', () => {
            render(<App />)
            expect(screen.getByTestId('map-container')).toBeInTheDocument()
        })
    })
})
