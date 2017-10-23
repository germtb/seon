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

	test('converts a declaration #3', () => {
		const tokens = tokenizer("x = 'Hello'")
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 'Hello',
			__type: 'String'
		})
	})

	test('can spread arrays in arrays', () => {
		const tokens = tokenizer(`
			x = [1, 2, 3]
			y = [0, ...x]
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
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

	test('converts an object expression #1', () => {
		const tokens = tokenizer('{}')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: {}, __type: 'Object' })
	})

	test('converts an object expression #2', () => {
		const tokens = tokenizer('{ x: 10 }')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: {
				x: { value: 10, __type: 'Number' }
			},
			__type: 'Object'
		})
	})

	test('converts an object expression #3', () => {
		const tokens = tokenizer(`
			x = 10
			y = { x }
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].y).toEqual({
			value: {
				x: { value: 10, __type: 'Number' }
			},
			__type: 'Object'
		})
	})

	test('converts an object expression #4', () => {
		const tokens = tokenizer(`
			x = { x: 10, y: 20 }
			y = { ...x }
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].y).toEqual({
			value: {
				x: { value: 10, __type: 'Number' },
				y: { value: 20, __type: 'Number' }
			},
			__type: 'Object'
		})
	})

	test('converts an object expression #5', () => {
		const tokens = tokenizer(`
			x = 'hello'
			y = { y1: 10, y2: 20 }
			z = { x, ...y, z: [ 0, 1, 2 ] }
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].z).toEqual({
			value: {
				x: { value: 'hello', __type: 'String' },
				y1: { value: 10, __type: 'Number' },
				y2: { value: 20, __type: 'Number' },
				z: {
					value: [
						{ value: 0, __type: 'Number' },
						{ value: 1, __type: 'Number' },
						{ value: 2, __type: 'Number' }
					],
					__type: 'Array'
				}
			},
			__type: 'Object'
		})
	})

	test('converts a function #1', () => {
		const tokens = tokenizer(`
			f = x => x
			x = f(10)
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 10,
			__type: 'Number'
		})
	})

	test('converts a function #2 ', () => {
		const tokens = tokenizer(`
		f = x => x
		x = f(x: 10)
	`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 10,
			__type: 'Number'
		})
	})

	test('converts a function #3 ', () => {
		const tokens = tokenizer(`
			f = (x, y) => x + y
			x = f(x: 10, y: 20)
		`)

		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 30,
			__type: 'Number'
		})
	})

	test('converts a function #4 ', () => {
		const tokens = tokenizer(`
			f = (x, y) => x / y
			x = f(y: 2, x: 4)
		`)

		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 2,
			__type: 'Number'
		})
	})

	test('converts a function #5', () => {
		const tokens = tokenizer(`
			f = (x, y) => x / y
			x = f(y: 2, 4)
		`)

		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 2,
			__type: 'Number'
		})
	})

	test('converts a function #6', () => {
		const tokens = tokenizer(`
			f = (x, y) => x / y
			x = f(4, y: 2)
		`)

		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 2,
			__type: 'Number'
		})
	})

	test('Auto currying #1', () => {
		const tokens = tokenizer(`
			f = (x, y, z) => x + y + z
			a = f(y: 10)
			b = a(z: 100)
			c = b(1)
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].c).toEqual({
			value: 111,
			__type: 'Number'
		})
	})
})
