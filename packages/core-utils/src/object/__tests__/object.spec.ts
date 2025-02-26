import { describe, it, expect } from 'vitest'
import * as obj from '../object'

describe('isObject', () => {
	it('identifies objects', () => {
		expect(obj.isObject({ a: '', b: 123, c: true })).toBe(true)
		expect(obj.isObject('Emily')).toBe(false)
		expect(obj.isObject(123)).toBe(false)
		expect(obj.isObject(BigInt(9007199254740991))).toBe(false)
		expect(obj.isObject([])).toBe(false)
		expect(obj.isObject(() => {})).toBe(false)
		expect(obj.isObject(Symbol('symbol'))).toBe(false)
		expect(obj.isObject(null)).toBe(false)
		expect(obj.isObject(undefined)).toBe(false)
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
		class Person {}
		const john = new Person()
		expect(obj.isObject(john)).toBe(true)
	})
})

describe('cloneObject', () => {
	it('does not return the source object', () => {
		const source = { a: 'a', b: 123, c: true }
		const copy = obj.cloneObject(source)

		expect(source === copy).toBe(false)
	})

	it('copies object properties', () => {
		const source = { a: 'a', b: 123, c: true }
		const copy = obj.cloneObject(source)

		expect(copy.a).toEqual(source.a)
		expect(copy.b).toEqual(source.b)
		expect(copy.c).toEqual(source.c)
	})

	it('does not return the source object (Custom class)', () => {
		class Person {}
		const john = new Person()
		const copy = obj.cloneObject(john)

		expect(john === copy).toBe(false)
	})

	it('maintains the custom class', () => {
		class Person {}
		const john = new Person()
		const copy = obj.cloneObject(john)

		expect(copy instanceof Person).toBe(true)
	})

	it('maintains the class prototype', () => {
		class Person {}
		const john = new Person()
		const copy = obj.cloneObject(john)

		expect(Object.getPrototypeOf(copy) === Person.prototype).toBe(true)
	})

	it('does not copy nested objects', () => {
		const source = { nested: { a: 'a' } }
		const copy = obj.cloneObject(source)

		expect(copy.nested.a).toEqual('a')
		expect(copy.nested === source.nested).toBe(true)
	})
})

describe('deepClone', () => {
	it('does not return the source object', () => {
		const source = { a: 'a', b: 123, c: true }
		const copy = obj.deepClone(source)

		expect(source === copy).toBe(false)
	})

	it('copies object properties', () => {
		const source = { a: 'a', b: 123, c: true }
		const copy = obj.deepClone(source)

		expect(copy.a).toEqual(source.a)
		expect(copy.b).toEqual(source.b)
		expect(copy.c).toEqual(source.c)
	})

	it('does not return the source object (Custom class)', () => {
		class Person {}
		const john = new Person()
		const copy = obj.deepClone(john)

		expect(john === copy).toBe(false)
	})

	it('maintains the custom class', () => {
		class Person {}
		const john = new Person()
		const copy = obj.deepClone(john)

		expect(copy instanceof Person).toBe(true)
	})

	it('maintains the class prototype', () => {
		class Person {}
		const john = new Person()
		const copy = obj.deepClone(john)

		expect(Object.getPrototypeOf(copy) === Person.prototype).toBe(true)
	})

	it('handles nested objects', () => {
		const source = { nested: { a: 'a' } }
		const copy = obj.deepClone(source)

		expect(copy.nested.a).toEqual(source.nested.a)
		expect(copy.nested === source.nested).toBe(false)
	})

	it('handles nested arrays', () => {
		const source = { nested: { a: [{ ab: 'ab' }, { ac: 'ac' }] } }
		const copy = obj.deepClone(source)

		expect(copy.nested.a).toEqual(source.nested.a)
		expect(copy.nested === source.nested).toBe(false)
	})

	it('handles cyclic references', () => {
		class Cycle {
			self: Cycle

			constructor() {
				this.self = this
			}
		}
		const source = new Cycle()
		const copy = obj.deepClone(source)

		expect(copy).toEqual(copy.self)
		expect(copy).toEqual(source)
		expect(copy.self === source.self).toBe(false)
	})

	it('handles dates', () => {
		const source = { a: new Date() }
		const copy = obj.cloneObject(source)

		expect(copy.a).toEqual(source.a)
		expect(copy === source).toBe(false)
	})

	it('handles non-enumerable properties', () => {
		const source = {}
		Object.defineProperties(source, {
			one: { enumerable: true, value: 1 },
			two: { enumerable: false, value: 2 }
		})

		const copy = obj.deepClone(source)

		expect(Object.keys(source)).not.toEqual(Object.getOwnPropertyNames(source))
		expect(Object.getOwnPropertyNames(source)).toEqual(Object.getOwnPropertyNames(copy))
	})
})

describe('createInstance', () => {
	it('keeps the source prototype', () => {
		class Person {}
		const john = new Person()
		const newJohn = obj.createInstance(john)

		expect(Object.getPrototypeOf(newJohn)).toEqual(Person.prototype)
	})

	it('keeps the source class', () => {
		class Person {}
		const john = new Person()
		const newJohn = obj.createInstance(john)

		expect(newJohn instanceof Person).toBe(true)
	})

	it('handles plain objects', () => {
		const o = {}
		const newO = obj.createInstance(o)

		expect(newO instanceof Object).toBe(true)
		expect(Object.getPrototypeOf(newO)).toEqual(Object.prototype)
	})

	it('handles arrays', () => {
		const a = [1, 2, 3]
		const newA = obj.createInstance(a)

		expect(newA instanceof Array).toBe(true)
		expect(Object.getPrototypeOf(newA)).toEqual(Array.prototype)
	})
})

describe('getPrototype', () => {
	it('handles plain objects', () => {
		expect(obj.getPrototype({})).toEqual(Object.prototype)
	})

	it('handles custom class objects', () => {
		class Person {
			greeting: string

			constructor(name: string) {
				this.greeting = `Hi! My name is ${name}`
			}
		}

		expect(obj.getPrototype(new Person('Slim Shady'))).toEqual(Person.prototype)
	})

	it('handles null instances', () => {
		expect(obj.getPrototype(null)).toEqual(Object.prototype)
	})
})
