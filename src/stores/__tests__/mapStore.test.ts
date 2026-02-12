import { describe, it, expect } from 'vitest'
import { useMapStore } from '../mapStore'

describe('hooks', () => {
    describe('【function 邏輯】useMapStore 初始狀態驗證', () => {
        it('useMapStore 初始狀態驗證', () => {
            const state = useMapStore.getState()
            expect(state.currentLocation).toEqual({ lat: 13.7563, lng: 100.5018 })
            expect(state.zoom).toBe(12)
            expect(state.selectedPlace).toBeNull()
        })
    })

    describe('【function 邏輯】useMapStore 更新狀態驗證', () => {
        it('useMapStore 更新狀態驗證', () => {
            const { setMapState } = useMapStore.getState()
            setMapState({ zoom: 15 })
            expect(useMapStore.getState().zoom).toBe(15)
        })
    })
})
