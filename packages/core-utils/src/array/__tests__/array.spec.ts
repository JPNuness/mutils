import { describe, it, expect } from 'vitest'
// functions
import * as arr from '../array'

describe('isArray', () => {
	it('identifies arrays', () => {
		// Array
		expect(arr.isArray([])).toBe(true)
		// Object
		expect(arr.isArray({})).toBe(false)
		// String
		expect(arr.isArray('')).toBe(false)
		// Number
		expect(arr.isArray(1)).toBe(false)
		// BigInt
		expect(arr.isArray(BigInt(9007199254740991))).toBe(false)
		// Function
		expect(arr.isArray(() => {})).toBe(false)
		// Symbol
		expect(arr.isArray(Symbol('symbol'))).toBe(false)
		// null
		expect(arr.isArray(null)).toBe(false)
		// undefined
		expect(arr.isArray(undefined)).toBe(false)
	})
})
