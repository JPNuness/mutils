import { describe, it, expect } from 'vitest'
import * as arr from '../array'

describe('isArray', () => {
	it('identifies arrays', () => {
		expect(arr.isArray([])).toBe(true)
		expect(arr.isArray({})).toBe(false)
		expect(arr.isArray('')).toBe(false)
		expect(arr.isArray(1)).toBe(false)
		expect(arr.isArray(BigInt(9007199254740991))).toBe(false)
		expect(arr.isArray(() => {})).toBe(false)
		expect(arr.isArray(Symbol('symbol'))).toBe(false)
		expect(arr.isArray(null)).toBe(false)
		expect(arr.isArray(undefined)).toBe(false)
		expect(arr.isArray(new Set())).toBe(false)
		expect(arr.isArray(new Map())).toBe(false)
		expect(arr.isArray(new Date())).toBe(false)
	})
})
