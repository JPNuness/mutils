import { isDefined } from '../common/common'

/**
 * Determines whether the source property should override the target property during a merge,
 * based on an optional priority rule.
 *
 * @param {unknown} targetProperty - The property from the target object.
 * @param {unknown} sourceProperty - The property from the source object.
 * @param {boolean | undefined} priorityRule - An optional flag that, if defined, indicates whether the source property should take precedence.
 * @returns {boolean} Returns `true` if the source property should be used over the target property, otherwise `false`.
 *
 * @example
 * // With priority rule defined:
 * keepSource("targetValue", "sourceValue", true); // returns true
 * keepSource("targetValue", "sourceValue", false) // returns false
 *
 * // Without priority rule:
 * keepSource("targetValue", "sourceValue", undefined)
 * keepSource(undefined, "sourceValue", undefined)
 */
export function keepSource(targetProperty: unknown, priorityRule: boolean | undefined): boolean {
	if (isDefined(priorityRule)) return priorityRule as boolean

	return !isDefined(targetProperty)
}
