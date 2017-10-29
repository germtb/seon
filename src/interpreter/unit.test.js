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
		expect(result).toEqual({ value: true, type: 'Boolean' })
	})

	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 1234, type: 'Number' })
	})

	test('converts a string', () => {
		const tokens = tokenizer("'1234'")
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: '1234', type: 'String' })
	})

	test('converts an array', () => {
		const tokens = tokenizer('[0, 1, 2]')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: [
				{ value: 0, type: 'Number' },
				{ value: 1, type: 'Number' },
				{ value: 2, type: 'Number' }
			],
			type: 'Array'
		})
	})

	test('converts a binary expression', () => {
		const tokens = tokenizer('10 + 5')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 15, type: 'Number' })
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
		expect(scopes[0].x).toEqual({ value: 10, type: 'Number' })
	})

	test('converts a declaration #2', () => {
		const tokens = tokenizer('x = [1, 2, 3]')
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: [
				{ value: 1, type: 'Number' },
				{ value: 2, type: 'Number' },
				{ value: 3, type: 'Number' }
			],
			type: 'Array'
		})
	})

	test('converts a declaration #3', () => {
		const tokens = tokenizer("x = 'Hello'")
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 'Hello',
			type: 'String'
		})
	})

	test('converts an array-shape declaration #1', () => {
		const tokens = tokenizer('[ x ] = [0, 1, 2, 3]')
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: 0,
			type: 'Number'
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
				{ value: 0, type: 'Number' },
				{ value: 1, type: 'Number' },
				{ value: 2, type: 'Number' },
				{ value: 3, type: 'Number' }
			],
			type: 'Array'
		})
	})

	test('converts an object expression #1', () => {
		const tokens = tokenizer('{}')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: {}, type: 'Object' })
	})

	test('converts an object expression #2', () => {
		const tokens = tokenizer('{ x: 10 }')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: {
				x: { value: 10, type: 'Number' }
			},
			type: 'Object'
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
				x: { value: 10, type: 'Number' }
			},
			type: 'Object'
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
				x: { value: 10, type: 'Number' },
				y: { value: 20, type: 'Number' }
			},
			type: 'Object'
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
				x: { value: 'hello', type: 'String' },
				y1: { value: 10, type: 'Number' },
				y2: { value: 20, type: 'Number' },
				z: {
					value: [
						{ value: 0, type: 'Number' },
						{ value: 1, type: 'Number' },
						{ value: 2, type: 'Number' }
					],
					type: 'Array'
				}
			},
			type: 'Object'
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
			type: 'Number'
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
			type: 'Number'
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
			type: 'Number'
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
			type: 'Number'
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
			type: 'Number'
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
			type: 'Number'
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
			type: 'Number'
		})
	})

	test('Pattern matching booleans #1', () => {
		const tokens = tokenizer('match true | true -> 1 | false -> 0')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 1, type: 'Number' })
	})

	test('Pattern matching booleans #2', () => {
		const tokens = tokenizer('match false | true -> 1 | false -> 0')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 0, type: 'Number' })
	})

	test('Pattern matching no pattern #1', () => {
		const tokens = tokenizer('match false | true -> 1 | _ -> 0')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 0, type: 'Number' })
	})

	test('Pattern matching number pattern #1', () => {
		const tokens = tokenizer('match 1 | 0 -> 1 | 1 -> 2 | _ -> 3')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 2, type: 'Number' })
	})

	test('Pattern matching any pattern #1', () => {
		const tokens = tokenizer('match 1 | 0 -> 1 | n -> n')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 1, type: 'Number' })
	})

	test('Pattern matching array pattern #2', () => {
		const tokens = tokenizer('match [] | [] -> 0 | [x, ...xs] -> x')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 0, type: 'Number' })
	})

	test('Pattern matching array pattern #3', () => {
		const tokens = tokenizer('match [ 1 ] | [] -> 0 | [ x ] -> x')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 1, type: 'Number' })
	})

	test('Pattern matching array pattern #4', () => {
		const tokens = tokenizer('match [ 1, 2 ] | [] -> 0 | [ x, y ] -> x + y')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 3, type: 'Number' })
	})

	test('Pattern matching array pattern #5', () => {
		const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, y ] -> x + y | _ -> 10')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 10, type: 'Number' })
	})

	test('Pattern matching array pattern with a rest element #1', () => {
		const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, ...xs ] -> x')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 1, type: 'Number' })
	})

	test('Pattern matching array pattern with a rest element #2', () => {
		const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, ...xs ] -> x')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({ value: 1, type: 'Number' })
	})

	test('Pattern matching array pattern with a rest element #3', () => {
		const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, ...xs ] -> xs')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: [{ value: 2, type: 'Number' }, { value: 3, type: 'Number' }],
			type: 'Array'
		})
	})

	test('Pattern matching object pattern #1', () => {
		const tokens = tokenizer('match {} | {} -> 0')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: 0,
			type: 'Number'
		})
	})

	test('Pattern matching object pattern #2', () => {
		const tokens = tokenizer('match { x: 1 } | {} -> 0 | { x } -> x')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: 1,
			type: 'Number'
		})
	})

	test('Pattern matching object pattern #3', () => {
		const tokens = tokenizer(
			'match { x: 1, y: 10 } | {} -> 0 | { x } -> x | { x, y } -> x + y'
		)
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: 11,
			type: 'Number'
		})
	})

	test('Pattern matching object pattern with a rest element #1', () => {
		const tokens = tokenizer(
			'match { x: 1, y: 10 } | {} -> 0 | { x, ...xs } -> xs'
		)
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: {
				y: { value: 10, type: 'Number' }
			},
			type: 'Object'
		})
	})

	test('let expression #1', () => {
		const tokens = tokenizer(`
			let x = 1
					y = 10
			in x + y
		`)
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual({
			value: 11,
			type: 'Number'
		})
	})

	test('import declaration #1', () => {
		const tokens = tokenizer("import x from './mock'")
		const nodes = parse(tokens)
		const scopes = [{ filename: __filename, dirname: __dirname }]
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: { x: { value: 10, type: 'Number' } },
			type: 'Object'
		})
	})

	test('module declaration', () => {
		const tokens = tokenizer('module = { x: 10 }')
		const nodes = parse(tokens)
		const scopes = [{}]
		aval(nodes[0], scopes)
		expect(scopes[0].module).toEqual({
			value: {
				x: { value: 10, type: 'Number' }
			},
			type: 'Object'
		})
	})
})
