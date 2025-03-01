import { is, isDefined } from '../common/common'

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

/**
 * Filters an array based on a predicate function.
 *
 * @template T - The expected array element class.
 * @param {Array<T>} source - The array to filter.
 * @param {(elem: T, idx: number) => boolean} fn - The predicate function to determine which elements to keep.
 * @returns {Array<T>} - A new array containing only elements for which `fn` returns `true`.
 *
 * @example
 * console.log(filter([1, 2, 3, 4], num => num % 2 === 0)); // [2, 4]
 * console.log(filter(['a', 'b', 'c'], char => char !== 'b')); // ['a', 'c']
 * console.log(filter([1, 2, 3, 4], (num, idx) => num > idx)); // [1, 2, 3, 4])
 */
export function filter<T>(source: Array<T>, fn: (elem: T, idx: number) => boolean): Array<T> {
	const result = []
	let currentIdx = -1

	while (++currentIdx < source.length) {
		if (fn(source[currentIdx], currentIdx)) result.push(source[currentIdx])
	}

	return result
}

export function findIndex<T>(source: Array<T>, fn: (elem: T, idx: number) => boolean): number {
	let currentIdx = -1

	while (++currentIdx < source.length) {
		if (fn(source[currentIdx], currentIdx)) return currentIdx
	}

	return -1
}

export function find<T>(source: Array<T>, fn: (elem: T, idx: number) => boolean): T | undefined {
	const idx = findIndex(source, fn)

	return idx === -1 ? undefined : source[idx]
}

/**
 * Removes nullish values from an array.
 *
 * @param {Array<unknown>} source - The array to compact.
 * @returns {Array<unknown>} - A new array with all falsy values removed.
 *
 * @example
 * console.log(compact([0, 1, false, 2, '', 3])); // [1, 2, 3]
 * console.log(compact([null, undefined, 0, '', 4, 5])); // [4, 5]
 */
export function compact(source: Array<unknown>): Array<unknown> {
	return filter(source, (e: unknown) => isDefined(e))
}
