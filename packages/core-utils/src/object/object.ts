/**
 * Checks if a value is a non-null object (but not an array).
 * @param {*} source - The value to check.
 * @returns {boolean} True if the value is an object, false otherwise.
 *
 * @example
 * const object = { id: 1, name: 'John Doe' }
 * console.log(isObject(object)) // true
 *
 * const nonObject = [0: '1', 1: 'John Doe']
 * console.log(isObject(nonObject)) // false
 */
export function isObject(source: unknown): boolean {
	return source !== null && typeof source === 'object' && !Array.isArray(source)
}

/**
 * Creates a new instance of an object, preserving its prototype.
 *
 * @param {T} source - The object to instantiate.
 * @returns {T | null} A new instance with the same prototype.
 *
 * @example
 * class User {
 *   constructor(public id: int, public name: string) {}
 * }
 *
 * const john = new User(123, 'John Doe')
 * const emptyUser = createNewInstance(john)
 *
 * console.log(emptyUser instanceof User) // true
 * console.log(emptyUser?.id) // undefined
 */
export function createNewInstance<T extends object>(source: T): T | null {
	if (source === null) return null

	return Object.create(Object.getPrototypeOf(source) as T) as T
}
