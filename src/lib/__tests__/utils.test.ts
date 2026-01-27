import { describe, it, expect } from 'vitest'
import { cn } from '../utils'

describe('lib', () => {
    describe('【function 邏輯】utils.cn 樣式合併驗證', () => {
        it('utils.cn 樣式合併驗證', () => {
            const result = cn('bg-red-500', 'bg-blue-500')
            // Tailwind-merge should pick the last one for conflicting classes
            expect(result).toContain('bg-blue-500')
            expect(result).not.toContain('bg-red-500')
        })
    })
})
