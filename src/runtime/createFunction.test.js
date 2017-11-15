import { createFunction } from './createFunction'

describe('runtime', () => {
	describe('createFunction', () => {
		test('a no parameter function', () => {
			const func = createFunction([], () => 10)
			expect(func()).toEqual(10)
		})

		test('a one parameter function', () => {
			const func = createFunction(['x'], ({ x }) => x)
			expect(func(0)).toEqual(0)
		})

		test('a two parameter function', () => {
			const func = createFunction(['x', 'y'], ({ x, y }) => x + y)
			expect(func(10, 1)).toEqual(11)
		})

		test('a two parameter function with named parameters', () => {
			const func = createFunction(['x', 'y'], ({ x, y }) => x + y)
			expect(
				func(
					{ type: 'NamedParameter', name: 'y', value: '1' },
					{ type: 'NamedParameter', name: 'x', value: '0' }
				)
			).toEqual('01')
			expect(
				func(
					{ type: 'NamedParameter', name: 'y', value: '0' },
					{ type: 'NamedParameter', name: 'x', value: '1' }
				)
			).toEqual('10')
		})

		test('a curried function', () => {
			const func = createFunction(['x', 'y'], ({ x, y }) => x + y)
			const curriedFunc = func('1')
			expect(curriedFunc('0')).toEqual('10')
		})

		test('a curried function with named parameters', () => {
			const func = createFunction(['x', 'y'], ({ x, y }) => x + y)
			const curriedFunc = func({
				type: 'NamedParameter',
				name: 'y',
				value: '1'
			})
			expect(curriedFunc('0')).toEqual('01')
		})
	})
})
