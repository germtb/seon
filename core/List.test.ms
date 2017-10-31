import { some, map, reduce, take, head } from './List'
import { test, describe, expect } from './Test'

describe('List', [
	test('some', [
		expect(some(x => x > 2, [0, 1, 2])).toBeTrue(),
		expect(some(x => x > 2, [0, 1, 2])).toBeFalse()
	])
])
