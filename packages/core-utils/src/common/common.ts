import { isArray } from '../array/array'
import { isObject } from '../object/object'

enum Primitives {
	STRING = 'string',
	NUMBER = 'number',
	BIGINT = 'bigint',
	BOOLEAN = 'boolean',
	SYMBOL = 'symbol',
	UNDEFINED = 'undefined'
}

/**
 * Checks if a value is neither null or undefined.
 * @param {*} source - The value to check.
 * @returns {boolean} True if the value is defined, false otherwise.
 *
 * @example
 * const object = { id: 1, name: 'John Doe' }
 * console.log(isDefined(object)) // true
 *
 * const nonObject = null
 * console.log(isDefined(nonObject)) // false
 */
export function isDefined(source: unknown): boolean {
	return source !== undefined && source !== null
}

/**
 * Checks if a value is of a primitive type.
 * @param {*} source - The value to check.
 * @returns {boolean} True if the value is a primitive, false otherwise.
 *
 * @example
 * const object = { id: 1, name: 'John Doe' }
 * console.log(isPrimitive(object)) // false
 *
 * const nonObject = null
 * console.log(isPrimitive(nonObject)) // true
 */
export function isPrimitive(source: unknown): boolean {
	return source === null || (typeof source) in Primitives
}

/**
 * Checks if a value is of a given class.
 * Use class definitions for custom classes, and strings for native ones
 *
 * @template T - The expected class.
 * @param {object} source - The value to check.
 * @param {(new (...args: unknown[]) => T) | string} cls - The class to compare against.
 * @returns {boolean} - `true` if `source` is an instance/type of `cls`, otherwise `false`.
 *
 * @example
 * class Person {}
 * const john = new Person()
 * console.log(is(john, 'Person')) // true
 * console.log(is({}, 'Person'));  // false
 *
 * @example
 * const john = 'John';
 * console.log(is(john, 'String')); // true
 * console.log(is(1, 'String'));   // false
 */
export function is<T>(
	source: unknown,
	cls: (new (...args: unknown[]) => T) | string | FunctionConstructor | SetConstructor
): boolean {
	if (typeof cls === 'string') {
		const sourceClass = Object.prototype.toString.call(source).slice(8, -1)
		return sourceClass === cls
	}

	return source instanceof cls
}

/**
 * Checks if a value is empty.
 * @param {object} source - The value to check.
 * @returns {boolean} True if the value is empty or not a collection, false otherwise.
 *
 * @example
 * const object = { id: 1, name: 'John Doe' }
 * console.log(isEmpty(object)) // false
 *
 * const object = { }
 * console.log(isEmpty(object)) // true
 */
export function isEmpty(source: unknown): boolean {
	if (!isDefined(source)) return true

	if (isArray(source) || typeof source === 'string')
		return !(source as string | Array<unknown>).length

	if (isObject(source)) {
		for (const _ of Object.getOwnPropertyNames(source)) {
			return false
		}
	}

	return true
}
