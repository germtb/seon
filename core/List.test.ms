import { map, reduce, some, head, filter, all, take, first } from './List'
import { test, describe, expect } from './Test'

describe('List', [
	test('map', [
		expect(map(x => x, [0, 1, 2])).toEqual([0, 1, 2]),
		expect(map(x => 2 * x, [0, 1, 2])).toEqual([0, 2, 4])
	]),
	test('reduce', [
		expect(reduce((acc, x) => acc + x, [0, 1, 2], 0)).toEqual(3)
	]),
	test('some', [
		expect(some(x => x > 1, [0, 1, 2])).toBeTrue(),
		expect(some(x => x > 2, [0, 1, 2])).toBeFalse()
	]),
	test('head', [expect(head([0, 1, 2])).toEqual(0)]),
	test('filter', [expect(filter(x => x > 1, [0, 1, 2])).toEqual([2])]),
	test('all', [
		expect(all(x => x >= 0, [0, 1, 2])).toBeTrue(),
		expect(all(x => x > 2, [0, 1, 2])).toBeFalse()
	])
	// test('take', [
	// 	expect(take(1, [0, 1, 2])).toEqual([0]),
	// 	expect(take(2, [0, 1, 2])).toBeFalse([0, 1])
	// ])
	// test('first', [
	// 	expect(first(x => x > 1, [0, 1, 2])).toEqual(2),
	// 	expect(first(x => x > 0, [0, 1, 2])).toBeFalse(1)
	// ])
])
