import { describe, it, expect } from 'vitest'
import * as obj from '../object'
import * as objInt from '../object.internal'

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
		const copy = obj.deepClone(source)

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

describe('deepEquals', () => {
	it('identifies equal objects', () => {
		const source = { a: 'a', b: 123, c: true }
		const copy = { a: 'a', b: 123, c: true }
		const nonCopy = { a: 'a', b: 123, c: false }

		expect(obj.deepEquals(source, copy)).toBe(true)
		expect(obj.deepEquals(source, nonCopy)).toBe(false)
	})
	it('handles comparable types', () => {
		const sourceStr = 'a' as unknown as object
		const copyStr = 'a' as unknown as object
		const sourceNr = 1 as unknown as object
		const copyNr = 1 as unknown as object

		expect(obj.deepEquals(sourceStr, copyStr)).toBe(true)
		expect(obj.deepEquals(sourceNr, copyNr)).toBe(true)
	})
	it('handles custom classes', () => {
		class Person {
			age: number

			constructor(age: number) {
				this.age = age
			}
		}
		const john = new Person(23)
		const copy = new Person(23)

		expect(obj.deepEquals(john, copy)).toBe(true)
	})
	it('handles arrays', () => {
		const source = { array: [1, 2, 3] }
		const copy = { array: [1, 2, 3] }
		const nonCopy = { array: [1, 2, 3, 4] }

		expect(obj.deepEquals(source, copy)).toBe(true)
		expect(obj.deepEquals(source, nonCopy)).toBe(false)
	})
	it('handles nested objects', () => {
		const source = { nested: { a: 'a' } }
		const copy = { nested: { a: 'a' } }

		expect(obj.deepEquals(source, copy)).toBe(true)
	})
	it('handles nested arrays', () => {
		const source = { nested: { a: [{ ab: 'ab' }, { ac: 'ac' }] } }
		const copy = { nested: { a: [{ ab: 'ab' }, { ac: 'ac' }] } }
		const nonCopy = { nested: { a: [{ aa: 'ab' }, { ac: 'ac' }] } }

		expect(obj.deepEquals(source, copy)).toBe(true)
		expect(obj.deepEquals(source, nonCopy as object)).toBe(false)
	})
	it('handles cyclic references in the same object', () => {
		class Cycle {
			self: Cycle
			selfOfSelf: Cycle

			constructor() {
				this.self = this
				this.selfOfSelf = this.self.self
			}
		}
		const source = new Cycle()
		const copy = source.self
		const selfCopy = source.selfOfSelf

		expect(obj.deepEquals(source, copy)).toBe(true)
		expect(obj.deepEquals(copy, selfCopy)).toBe(true)
	})
	it('handles cyclic references in different objects', () => {
		class Cycle {
			other?: Cycle

			constructor() {
				this.other = undefined
			}
		}

		const a = new Cycle()
		const b = new Cycle()

		a.other = b
		b.other = a

		expect(obj.deepEquals(a, b)).toBe(true)
	})
	it('handles dates', () => {
		const source = { a: new Date('05/05/2000') }
		const copy = { a: new Date('05/05/2000') }
		const nonCopy = { a: new Date('05/07/2000') }

		expect(obj.deepEquals(source, copy)).toBe(true)
		expect(obj.deepEquals(source, nonCopy)).toBe(false)
	})
})

describe('merge', () => {
	it('merges two objects with no conflicts', () => {
		const target = { a: 'a', b: 123, c: true }
		const source = { d: 'd', e: 456, f: false }

		expect(obj.merge(target, source)).toEqual({
			a: 'a',
			b: 123,
			c: true,
			d: 'd',
			e: 456,
			f: false
		})
	})
	it('merges two objects with no conflicts and priority rules', () => {
		const target = { a: 'a', b: 123, c: true }
		const source = { d: 'd', e: 456, f: false }
		const priorityRules = { a: true, c: true }

		expect(obj.merge(target, source, priorityRules)).toEqual({
			// Source has no a or c properties defined
			a: undefined,
			b: 123,
			c: undefined,
			d: 'd',
			e: 456,
			f: false
		})
	})
	it('merges two objects with conflicts and priority rules', () => {
		const target = { a: 'a', b: 123, c: true }
		const source = { a: 'd', b: 456, c: false }
		const priorityRules = { a: true, c: true }

		expect(obj.merge(target, source, priorityRules)).toEqual({
			a: 'd',
			b: 123,
			c: false
		})
	})
	it('keeps source properties if target properties are undefined', () => {
		const target = { a: 'a' }
		const source = { a: 'd', b: 456, c: false }

		expect(obj.merge(target, source)).toEqual({
			a: 'a',
			b: 456,
			c: false
		})
	})
	it('keeps source properties with priority rules, even if undefined', () => {
		const target = { a: 'a', b: 123, c: true }
		const source = { a: 'a' }
		const priorityRules = { b: true, c: true }

		expect(obj.merge(target, source, priorityRules)).toEqual({
			a: 'a',
			b: undefined,
			c: undefined
		})
	})
	it('merges nested objects without conflicts', () => {
		const target = { a: 'a', b: 123, c: { ca: 'ca', cb: 'cb' } }
		const source = { a: 'd', b: 456, c: { cc: 'cc', cd: 'cd' } }

		expect(obj.merge(target, source)).toEqual({
			a: 'a',
			b: 123,
			c: { ca: 'ca', cb: 'cb', cc: 'cc', cd: 'cd' }
		})
	})
	it('obeys priority rules on nested objects', () => {
		const target = { a: 'a', b: 123, c: { ca: 'ca', cb: 'cb' } }
		const source = { a: 'd', b: 456, c: { ca: 'cc', cd: 'cd' } }
		const priorityRules = { c: true }

		expect(obj.merge(target, source, priorityRules)).toEqual({
			// all shared properties in c are from the source object
			a: 'a',
			b: 123,
			c: { ca: 'cc', cb: 'cb', cd: 'cd' }
		})
	})
	it('copies target when source is not defined', () => {
		const target = {
			a: 'a',
			b: 123,
			c: [1, 2, 3],
			d: { da: { daa: 'daa', dab: [7, 8, 9] }, db: new Date(), dc: [4, 5, 6] }
		}
		const copy = obj.merge(target)

		expect(copy).toEqual(target)
		expect(copy === target).toBe(false)
	})
	it('does not merge arrays', () => {
		const target = { a: 'a', b: 123, c: [1, 2, 3] }
		const source = { d: 'd', e: 456, c: [4, 5, 6] }

		expect(obj.merge(target, source)).toEqual({
			a: 'a',
			b: 123,
			c: [1, 2, 3],
			d: 'd',
			e: 456
		})
	})
	it('handles empty objects', () => {
		const target = {}
		const source = {}

		expect(obj.merge(target, source)).toEqual({})
	})
	it('Does not use priority rules for properties that are not in the target nor the source', () => {
		const target = { a: 'a' }
		const source = { b: 1 }
		const priorityRules = { c: true }

		expect(obj.merge(target, source, priorityRules)).toEqual({ a: 'a', b: 1 })
	})
})

describe('keepSource', () => {
	it('returns priorityRule if defined', () => {
		expect(objInt.keepSource(1, true)).toBe(true)
		expect(objInt.keepSource(1, false)).toBe(false)
		expect(objInt.keepSource(undefined, true)).toBe(true)
		expect(objInt.keepSource(undefined, false)).toBe(false)
	})
	it('returns false if targetProperty exists and no priority rule is given', () => {
		expect(objInt.keepSource(1, undefined)).toBe(false)
		expect(objInt.keepSource('text', undefined)).toBe(false)
		expect(objInt.keepSource({}, undefined)).toBe(false)
		expect(objInt.keepSource([], undefined)).toBe(false)
		expect(objInt.keepSource(Symbol('sym'), undefined)).toBe(false)
	})
	it('returns true if targetProperty is undefined and no priority rule is given', () => {
		expect(objInt.keepSource(undefined, undefined)).toBe(true)
		expect(objInt.keepSource(null, undefined)).toBe(true)
	})
	it('correctly differentiates between falsy but defined values', () => {
		expect(objInt.keepSource(0, undefined)).toBe(false)
		expect(objInt.keepSource(false, undefined)).toBe(false)
		expect(objInt.keepSource('', undefined)).toBe(false)
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
