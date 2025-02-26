import { isArray } from '../array/array'
import { isDefined } from '../common/common'

/**
 * Checks if a value is a non-null object (but not an array).
 * @param {*} source - The value to check.
 * @returns {boolean} True if the value is an object, false otherwise.
 *
 * @example
 * const object = { id: 1, name: 'John Doe' }
 * console.log(isObject(object)) // true
 *
 * const nonObject = ['1', 'John Doe']
 * console.log(isObject(nonObject)) // false
 */
export function isObject(source: unknown): boolean {
	return isDefined(source) && typeof source === 'object' && !Array.isArray(source)
}

/**
 * Creates a shallow copy of the given object.
 * Use `deepCopy` if nested objects or arrays need to be cloned.
 *
 * @template T - The type of the object to copy.
 * @param {NonNullable<T>} source - The object to copy.
 * @returns {T} A new object with the same properties as the source.
 *
 * @example
 * const original = { id: 1, name: 'Alice' }
 * const copy = shallowCopy(original)
 * console.log(copy) // { id: 1, name: 'Alice' }
 */
export function cloneObject<T extends object>(source: NonNullable<T>): T {
	return Object.assign(createInstance(source), source)
}

/**
 * Creates a deep copy of an object. Handles primitives, dates, arrays and objects.
 * Will be expanded with other types (Regexp, Maps, Sets, ...)
 *
 * @template T - The type of the object to be copied.
 * @param {T} source - The object to deep copy.
 * @param {WeakMap<object, unknown>} seenSources - A map to track already copied objects and prevent cyclic references.
 * @returns {T} A fully independent deep copy of the source object.
 *
 * @example
 * const obj = { name: "John Doe", details: { age: 30 }, date: new Date(), friends: ['Mary', 'Joe'] };
 * const copy = deepCopy(obj)
 * console.log(copy.details.age) // 30
 * console.log(copy.date instanceof Date) // true
 * console.log(copy.friends instanceof Array) // true
 *
 * @example
 * // Handles cyclic references
 * const circular = { name: "Loop" }
 * circular.self = circular
 * const clonedCircular = deepCopy(circular)
 * console.log(clonedCircular.self === clonedCircular) // true
 */
export function deepClone<T extends object>(
	source: T,
	seenSources: WeakMap<object, unknown> = new WeakMap()
): T {
	const isCopyable: boolean = !(isObject(source) || isArray(source))

	if (isCopyable) return source

	// Dates
	if (source instanceof Date) return new Date(source.getTime()) as T

	// Cyclic references
	if (seenSources.has(source)) return seenSources.get(source) as T

	// Arrays and objects
	const clone: T = Array.isArray(source) ? ([] as T) : createInstance(source)
	seenSources.set(source, clone)

	for (const key of Object.getOwnPropertyNames(source) as (keyof T)[]) {
		;(clone as Record<keyof T, unknown>)[key] = deepClone(source[key] as T, seenSources)
	}

	return clone
}

/**
 * Merges two objects based on priority rules, including nested objects.
 * - If a property exists in both `source` and `target`, `priorityRules` determines which value to keep.
 * - Defaults to `target` properties.
 * - If a property exists in only one object, that value is retained.
 *
 * @template T - The type of the object to be merged.
 * @param {NonNullable<T>} target - The target object, which serves as the base.
 * @param {T} [source] - The source object, providing new properties. Defaults to an empty instance of `target`.
 * @param {Record<string, boolean>} [priorityRules] - A map defining which properties should keep its `source` value (`true`) over the `target` value (`false`).
 * @returns {T} The merged object.
 *
 * @example
 * const target = { name: "Emily", age: 30, details: { city: "Paris" } }
 * const source = { age: 35, details: { country: "France" } }
 * const priorityRules = { age: true } // Keep `source.age`
 *
 * const result = merge(target, source, priorityRules)
 * console.log(result)
 * // Output: { name: "Emily", age: 35, details: { city: "Paris", country: "France" } }
 */
export function merge<T extends object>(
	target: NonNullable<T>,
	source: T = createInstance(target),
	priorityRules: Record<string, boolean> = {}
): T {
	const merged = createInstance(target)

	const mergedKeys = new Set([
		...(Object.keys(source) as (keyof T)[]),
		...(Object.keys(target) as (keyof T)[])
	])

	for (const key of mergedKeys) {
		const targetProperty = target[key] as T
		const sourceProperty = source[key] as T
		const keepSourceProp = keepSource(sourceProperty, priorityRules[key])

		if (isObject(targetProperty) && isObject(sourceProperty)) {
			;(merged as Record<keyof T, unknown>)[key] = keepSourceProp
				? merge(sourceProperty, targetProperty)
				: merge(targetProperty, sourceProperty)

			continue
		}

		merged[key] = keepSourceProp ? source[key] : target[key]
	}

	return merged
}

/**
 * Retrieves the prototype of an object. Defaults to `Object.prototype`
 *
 * @template T - The object type.
 * @param {T} source - The object whose prototype should be retrieved.
 * @returns {object} The prototype of the provided object.
 *
 * @example
 * const obj = { name: "Alice" }
 * const proto = getPrototype(obj)
 * console.log(proto === Object.prototype) // true
 */
function getPrototype<T extends object>(source: T): object {
	const prototype = Object.getPrototypeOf(source) as object
	return prototype ?? Object.prototype
}

/**
 * Creates a new instance of an object while preserving its prototype.
 *
 * @template T - The object type.
 * @param {NonNullable<T>} source - The object to create an instance from.
 * @returns {T} A new instance of the object with the same prototype.
 *
 * @example
 * class Person {
 *   constructor(public name: string) {}
 * }
 * const original = new Person("Emily")
 * const copy = createInstance(original)
 *
 * console.log(Object.getPrototypeOf(copy) === Object.getPrototypeOf(original))
 * // Output: true
 */
function createInstance<T extends object>(source: NonNullable<T>): T {
	return Object.create(getPrototype(source)) as T
}

/**
 * Determines whether a source property should be kept during a merge, based on priority rules.
 *
 * @param {unknown} sourceProperty - The property from the source object.
 * @param {boolean | undefined} priorityRule - A flag indicating if the source property should take precedence over the target.
 * @returns {boolean} `true` if the source property should be kept, otherwise `false`.
 *
 * @example
 * keepSource("name", true);  // true (source is defined, priority is true)
 * keepSource("name", false); // false (priority is false)
 * keepSource(undefined, true); // false (source is undefined)
 * keepSource("name", undefined); // false (priority is undefined)
 */
function keepSource(sourceProperty: unknown, priorityRule: boolean | undefined): boolean {
	return isDefined(sourceProperty) && isDefined(priorityRule) && (priorityRule as boolean)
}
