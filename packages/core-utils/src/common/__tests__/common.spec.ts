import { describe, it, expect } from 'vitest'
// functions
import * as com from '../common'

describe('isDefined', () => {
	it('detects undefined or null', () => {
		expect(com.isDefined(null)).toBe(false)
		expect(com.isDefined(undefined)).toBe(false)
	})
	it('detects defined objects', () => {
		expect(com.isDefined('Emily')).toBe(true)
		expect(com.isDefined({ name: 'Emily' })).toBe(true)
		expect(com.isDefined(123)).toBe(true)
		expect(com.isDefined(BigInt(9007199254740991))).toBe(true)
		expect(com.isDefined([1, 2, 3])).toBe(true)
		expect(com.isDefined(() => {})).toBe(true)
		expect(com.isDefined(Symbol('symbol'))).toBe(true)
	})
})

describe('isEmpty', () => {
	it('considers non-collection types empty', () => {
		expect(com.isEmpty(123)).toBe(true)
		expect(com.isEmpty(BigInt(9007199254740991))).toBe(true)
		expect(
			com.isEmpty(() => {
				return
			})
		).toBe(true)
		expect(com.isEmpty(Symbol('symbol'))).toBe(true)
	})
	it('works on null values', () => {
		expect(com.isEmpty(null)).toBe(true)
	})
	it('works on undefined values', () => {
		expect(com.isEmpty(undefined)).toBe(true)
	})
	it('works on strings', () => {
		expect(com.isEmpty('')).toBe(true)
		expect(com.isEmpty('Emily')).toBe(false)
	})
	it('works on arrays', () => {
		expect(com.isEmpty([])).toBe(true)
		expect(com.isEmpty([1, 2, 3])).toBe(false)
	})
	it('works on objects', () => {
		expect(com.isEmpty({})).toBe(true)
		expect(com.isEmpty({ name: 'Emily' })).toBe(false)
	})
})

describe('is', () => {
	it('identifies primitive classes', () => {
		expect(com.is('', 'String')).toBe(true)
		expect(com.is(1, 'Number')).toBe(true)
		expect(com.is(BigInt(9007199254740991), 'BigInt')).toBe(true)
		expect(com.is(Symbol('symbol'), 'Symbol')).toBe(true)
		expect(com.is(undefined, 'Undefined')).toBe(true)
	})
	it('identifies non-primitive classes', () => {
		expect(com.is([], 'Array')).toBe(true)
		expect(com.is(new Date(), 'Date')).toBe(true)
		expect(com.is(new Map(), 'Map')).toBe(true)
		expect(com.is(new Set(), 'Set')).toBe(true)
		expect(com.is(() => {}, 'Function')).toBe(true)
		expect(com.is({}, 'Object')).toBe(true)
	})
	it('identifies non-primitive classes through their constructor', () => {
		expect(com.is([], Array)).toBe(true)
		expect(com.is(new Date(), Date)).toBe(true)
		expect(com.is(new Map(), Map)).toBe(true)
		expect(com.is(new Set(), Set)).toBe(true)
		expect(com.is(() => {}, Function)).toBe(true)
		expect(com.is({}, Object)).toBe(true)
	})
	it('identifies null as Null', () => {
		expect(com.is(null, 'Null')).toBe(true)
		// null is an object, but has prototype Null
		expect(com.is(null, Object)).toBe(false)
		expect(com.is(null, 'Object')).toBe(false)
	})
	it('identifies user classes', () => {
		class Person {}
		const john = new Person()

		expect(com.is(john, 'Person')).toBe(false)
		expect(com.is({}, Person)).toBe(false)
		expect(com.is(john, Person)).toBe(true)
	})
})
