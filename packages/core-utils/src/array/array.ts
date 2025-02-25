import { is } from '../common/common'

export function isArray(source: unknown): boolean {
	return is(source, Array)
}
