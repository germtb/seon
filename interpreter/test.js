import tokenizer from '../tokenizer'
import parse from '../parser'
import { aval } from './index'

describe('interpreter', () => {
	let scopes
	beforeEach(() => {
		scopes = [{}]
	})

	test('converts a boolean', () => {
		const tokens = tokenizer('true')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: true, __type: 'Boolean' })
	})

	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 1234, __type: 'Number' })
	})

	test('converts a string', () => {
		const tokens = tokenizer("'1234'")
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: '1234', __type: 'String' })
	})

	test('converts an array', () => {
		const tokens = tokenizer('[0, 1, 2]')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: [
				{ value: 0, __type: 'Number' },
				{ value: 1, __type: 'Number' },
				{ value: 2, __type: 'Number' }
			],
			__type: 'Array'
		})
	})

	test('converts a binary expression', () => {
		const tokens = tokenizer('10 + 5')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 15, __type: 'Number' })
	})

	test('converts a unary expression', () => {
		const tokens = tokenizer('!true')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual(false)
	})

	test('converts a declaration #1', () => {
		const tokens = tokenizer('x = 10')
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({ value: 10, __type: 'Number' })
	})

	test('converts a declaration #2', () => {
		const tokens = tokenizer('x = [1, 2, 3]')
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: [
				{ value: 1, __type: 'Number' },
				{ value: 2, __type: 'Number' },
				{ value: 3, __type: 'Number' }
			],
			__type: 'Array'
		})
	})

	test('can spread arrays in arrays', () => {
		const tokens = tokenizer(`
			x = [1, 2, 3]
			y = [0, ...x]
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: [
				{ value: 1, __type: 'Number' },
				{ value: 2, __type: 'Number' },
				{ value: 3, __type: 'Number' }
			],
			__type: 'Array'
		})
		expect(scopes[0].y).toEqual({
			value: [
				{ value: 0, __type: 'Number' },
				{ value: 1, __type: 'Number' },
				{ value: 2, __type: 'Number' },
				{ value: 3, __type: 'Number' }
			],
			__type: 'Array'
		})
	})
})
