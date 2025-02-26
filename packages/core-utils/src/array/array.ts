import { is } from '../common/common'

/**
 * Checks if a given value is an array.
 *
 * @param {unknown} source - The value to check.
 * @returns {boolean} - `true` if `source` is an array, `false` otherwise.
 *
 * @example
 * console.log(isArray([])); // true
 * console.log(isArray({})); // false
 * console.log(isArray('Hello')); // false
 * console.log(isArray(new Array())); // true
 */
export function isArray(source: unknown): boolean {
	return is(source, Array)
}
