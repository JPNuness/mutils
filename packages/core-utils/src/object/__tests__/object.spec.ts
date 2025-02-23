import { describe, it, expect } from 'vitest'
// functions
import * as obj from '../object'
//test data
import { object, classObject } from './testdata'

describe('isDefined', () => {
	it('detects undefined or null', () => {
		// null
		expect(obj.isDefined(object.wife)).toBe(false)
		// undefined
		expect(obj.isDefined(object.pet)).toBe(false)
	})
	it('detects defined objects', () => {
		// String
		expect(obj.isDefined(object.name)).toBe(true)
		// Object
		expect(obj.isDefined(object)).toBe(true)
		// Number
		expect(obj.isDefined(object.age)).toBe(true)
		// Array
		expect(obj.isDefined(object.friends)).toBe(true)
		// Function
		expect(obj.isDefined(object.checkAge)).toBe(true)
		// Symbol
		expect(obj.isDefined(object.id)).toBe(true)
	})
})

describe('isObject', () => {
	it('identifies objects', () => {
		// Object
		expect(obj.isObject(object)).toBe(true)
		// String
		expect(obj.isObject(object.name)).toBe(false)
		// Number
		expect(obj.isObject(object.age)).toBe(false)
		// Array
		expect(obj.isObject(object.friends)).toBe(false)
		// Function
		expect(obj.isObject(object.checkAge)).toBe(false)
		// Symbol
		expect(obj.isObject(object.id)).toBe(false)
		// null
		expect(obj.isObject(object.wife)).toBe(false)
		// undefined
		expect(obj.isObject(object.pet)).toBe(false)
	})
	it('identifies empty objects', () => {
		expect(obj.isObject({})).toBe(true)
	})
	it('identifies objects created with Object.create', () => {
		expect(obj.isObject(Object.create(null))).toBe(true)
	})
	it('identifies objects created with new Object()', () => {
		expect(obj.isObject(new Object())).toBe(true)
	})
	it('identifies class objects', () => {
		expect(obj.isObject(classObject)).toBe(true)
	})
})
