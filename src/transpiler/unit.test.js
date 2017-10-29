import tokenizer from '../tokenizer'
import parse from '../parser'
import { transpile } from './index'

describe('transpile', () => {
	test('a boolean', () => {
		const tokens = tokenizer('true')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('true')
	})

	test('a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('1234')
	})

	test('a string', () => {
		const tokens = tokenizer("'1234'")
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('"1234"')
	})

	test('an array', () => {
		const tokens = tokenizer('[0, 1, 2]')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('[0, 1, 2]')
	})

	test('an object', () => {
		const tokens = tokenizer('{ x: 10 }')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('{ x: 10 }')
	})

	test('a binary expression', () => {
		const tokens = tokenizer('10 + 5')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('10 + 5')
	})

	test('a unary expression', () => {
		const tokens = tokenizer('!true')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('!true')
	})

	test('a declaration #1', () => {
		const tokens = tokenizer('x = 10')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = 10')
	})

	test('a declaration #2', () => {
		const tokens = tokenizer('x = [1, 2, 3]')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = [1, 2, 3]')
	})

	test('a declaration #3', () => {
		const tokens = tokenizer("x = 'Hello'")
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = "Hello"')
	})

	test('an object access #1', () => {
		const tokens = tokenizer("x = { test: 'Hello' }\ny = x.test")
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = { test: "Hello" }\nconst y = x.test')
	})

	// test('an array-shape declaration #1', () => {
	// 	const tokens = tokenizer('[ x ] = [0, 1, 2, 3]')
	// 	const nodes = parse(tokens)
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].x).toEqual({
	// 		value: 0,
	// 		type: 'Number'
	// 	})
	// })

	test('can spread arrays in arrays', () => {
		const tokens = tokenizer('x = [1, 2, 3]\ny = [0, ...x]')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = [1, 2, 3]\nconst y = [0, ...x]')
	})

	test('an object expression #1', () => {
		const tokens = tokenizer('{}')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('{}')
	})

	test('an object expression #2', () => {
		const tokens = tokenizer('{ x: 10 }')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('{ x: 10 }')
	})

	test('an object expression #3', () => {
		const tokens = tokenizer('x = 10\ny = { x }')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = 10\nconst y = { x }')
	})

	test('an object expression #4', () => {
		const tokens = tokenizer('x = { x: 10, y: 20 }\ny = { ...x } ')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = { x: 10, y: 20 }\nconst y = { ...x }')
	})

	test('an object expression #5', () => {
		const tokens = tokenizer(
			"x = 'hello'\ny = { y1: 10, y2: 20 }\nz = { x, ...y, z: [ 0, 1, 2 ] }"
		)
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			'const x = "hello"\nconst y = { y1: 10, y2: 20 }\nconst z = { x, ...y, z: [0, 1, 2] }'
		)
	})

	test('a function #1', () => {
		const tokens = tokenizer('f = x => x\nx = f(10)')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const f = x => x\nconst x = f(10)')
	})

	// test('a function #2 ', () => {
	// 	const tokens = tokenizer('f = x => x\nx = f(x: 10) ')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0])
	// 	expect(result).toEqual('const f = x => x\nconst x = f(10)')
	// })

	// test('a function #3 ', () => {
	// 	const tokens = tokenizer(`
	// 		f = (x, y) => x + y
	// 		x = f(x: 10, y: 20)
	// 	`)
	//
	// 	const nodes = parse(tokens)
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].x).toEqual({
	// 		value: 30,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('a function #4 ', () => {
	// 	const tokens = tokenizer(`
	// 		f = (x, y) => x / y
	// 		x = f(y: 2, x: 4)
	// 	`)
	//
	// 	const nodes = parse(tokens)
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].x).toEqual({
	// 		value: 2,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('a function #5', () => {
	// 	const tokens = tokenizer(`
	// 		f = (x, y) => x / y
	// 		x = f(y: 2, 4)
	// 	`)
	//
	// 	const nodes = parse(tokens)
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].x).toEqual({
	// 		value: 2,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('a function #6', () => {
	// 	const tokens = tokenizer(`
	// 		f = (x, y) => x / y
	// 		x = f(4, y: 2)
	// 	`)
	//
	// 	const nodes = parse(tokens)
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].x).toEqual({
	// 		value: 2,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('Auto currying #1', () => {
	// 	const tokens = tokenizer(`
	// 		f = (x, y, z) => x + y + z
	// 		a = f(y: 10)
	// 		b = a(z: 100)
	// 		c = b(1)
	// 	`)
	// 	const nodes = parse(tokens)
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].c).toEqual({
	// 		value: 111,
	// 		type: 'Number'
	// 	})
	// })

	// test('Pattern matching booleans #1', () => {
	// 	const tokens = tokenizer('match true | true -> 1 | false -> 0')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 1, type: 'Number' })
	// })

	// test('Pattern matching booleans #2', () => {
	// 	const tokens = tokenizer('match false | true -> 1 | false -> 0')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 0, type: 'Number' })
	// })
	//
	// test('Pattern matching no pattern #1', () => {
	// 	const tokens = tokenizer('match false | true -> 1 | _ -> 0')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 0, type: 'Number' })
	// })
	//
	// test('Pattern matching number pattern #1', () => {
	// 	const tokens = tokenizer('match 1 | 0 -> 1 | 1 -> 2 | _ -> 3')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 2, type: 'Number' })
	// })
	//
	// test('Pattern matching any pattern #1', () => {
	// 	const tokens = tokenizer('match 1 | 0 -> 1 | n -> n')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 1, type: 'Number' })
	// })
	//
	// test('Pattern matching array pattern #2', () => {
	// 	const tokens = tokenizer('match [] | [] -> 0 | [x, ...xs] -> x')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 0, type: 'Number' })
	// })
	//
	// test('Pattern matching array pattern #3', () => {
	// 	const tokens = tokenizer('match [ 1 ] | [] -> 0 | [ x ] -> x')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 1, type: 'Number' })
	// })
	//
	// test('Pattern matching array pattern #4', () => {
	// 	const tokens = tokenizer('match [ 1, 2 ] | [] -> 0 | [ x, y ] -> x + y')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 3, type: 'Number' })
	// })
	//
	// test('Pattern matching array pattern #5', () => {
	// 	const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, y ] -> x + y | _ -> 10')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 10, type: 'Number' })
	// })
	//
	// test('Pattern matching array pattern with a rest element #1', () => {
	// 	const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, ...xs ] -> x')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 1, type: 'Number' })
	// })
	//
	// test('Pattern matching array pattern with a rest element #2', () => {
	// 	const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, ...xs ] -> x')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({ value: 1, type: 'Number' })
	// })
	//
	// test('Pattern matching array pattern with a rest element #3', () => {
	// 	const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, ...xs ] -> xs')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({
	// 		value: [{ value: 2, type: 'Number' }, { value: 3, type: 'Number' }],
	// 		type: 'Array'
	// 	})
	// })
	//
	// test('Pattern matching object pattern #1', () => {
	// 	const tokens = tokenizer('match {} | {} -> 0')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({
	// 		value: 0,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('Pattern matching object pattern #2', () => {
	// 	const tokens = tokenizer('match { x: 1 } | {} -> 0 | { x } -> x')
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({
	// 		value: 1,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('Pattern matching object pattern #3', () => {
	// 	const tokens = tokenizer(
	// 		'match { x: 1, y: 10 } | {} -> 0 | { x } -> x | { x, y } -> x + y'
	// 	)
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({
	// 		value: 11,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('Pattern matching object pattern with a rest element #1', () => {
	// 	const tokens = tokenizer(
	// 		'match { x: 1, y: 10 } | {} -> 0 | { x, ...xs } -> xs'
	// 	)
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({
	// 		value: {
	// 			y: { value: 10, type: 'Number' }
	// 		},
	// 		type: 'Object'
	// 	})
	// })
	//
	// test('let expression #1', () => {
	// 	const tokens = tokenizer(`
	// 		let x = 1
	// 				y = 10
	// 		in x + y
	// 	`)
	// 	const nodes = parse(tokens)
	// 	const result = transpile(nodes[0].nodes[0])
	// 	expect(result).toEqual({
	// 		value: 11,
	// 		type: 'Number'
	// 	})
	// })
	//
	// test('import declaration #1', () => {
	// 	const tokens = tokenizer("import x from './mock'")
	// 	const nodes = parse(tokens)
	// 	const scopes = [{ filename: __filename, dirname: __dirname }]
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].x).toEqual({
	// 		value: { x: { value: 10, type: 'Number' } },
	// 		type: 'Object'
	// 	})
	// })
	//
	// test('module declaration', () => {
	// 	const tokens = tokenizer('module = { x: 10 }')
	// 	const nodes = parse(tokens)
	// 	const scopes = [{}]
	// 	transpile(nodes[0], scopes)
	// 	expect(scopes[0].module).toEqual({
	// 		value: {
	// 			x: { value: 10, type: 'Number' }
	// 		},
	// 		type: 'Object'
	// 	})
	// })
})
