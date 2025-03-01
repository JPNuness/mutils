import { describe, it, expect } from 'vitest'
import * as arr from '../array'

// Aux functions
import { isDefined } from '../../common/common'

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

describe('filter', () => {
	it('filters items', () => {
		const array = [1, 2, 3, 4, 5]
		const func = (elem: number) => elem % 2 !== 0

		expect(array.length).toEqual(5)
		expect(arr.filter(array, func)).toEqual([1, 3, 5])
	})

	it('returns an empty array if no items match', () => {
		const array = [1, 2, 3, 4, 5]
		const func = () => false

		expect(arr.filter(array, func)).toEqual([])
	})

	it('handles multi-typed arrays', () => {
		const array = [1, 'Emily', 0, false, undefined]
		const func = (elem: unknown) => !isDefined(elem)

		expect(arr.filter(array, func)).toEqual([undefined])
	})

	it('handles both the element and the index in the predicate', () => {
		const array = [1, 2, 3, 4, 5]
		const func = (elem: number, idx: number) => elem > idx

		expect(arr.filter(array, func)).toEqual(array)
	})
})

describe('compact', () => {
	it('removes nullish values from arrays', () => {
		const array = [0, undefined, 4, 6, null]

		expect(arr.compact(array)).toEqual([0, 4, 6])
	})

	it('returns an empty array if all items are nullish', () => {
		const array = [null, undefined]

		expect(arr.compact(array)).toEqual([])
	})
})
