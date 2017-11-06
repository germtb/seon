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
		const tokens = tokenizer('[ 0, 1, 2 ]')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('[ 0, 1, 2 ]')
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
		expect(result).toEqual('const x = [ 1, 2, 3 ]')
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

	test('an array-shape declaration #1', () => {
		const tokens = tokenizer('[ x ] = [ 0, 1, 2, 3 ]')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const [ x ] = [ 0, 1, 2, 3 ]')
	})

	test('can spread arrays in arrays', () => {
		const tokens = tokenizer('x = [ 1, 2, 3 ]\ny = [ 0, ...x ]')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual('const x = [ 1, 2, 3 ]\nconst y = [ 0, ...x ]')
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
			'const x = "hello"\nconst y = { y1: 10, y2: 20 }\nconst z = { x, ...y, z: [ 0, 1, 2 ] }'
		)
	})

	test('a function #1', () => {
		const tokens = tokenizer('x => x')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual("createFunction(['x'], ({ x }) => x)")
	})

	test('a function #2 ', () => {
		const tokens = tokenizer(['f = x => x', 'x = f(x: 10)'].join('\n'))
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				"const f = createFunction(['x'], ({ x }) => x)",
				"const x = f([{ type: 'NamedParameter', name: 'x', value: 10 }])"
			].join('\n')
		)
	})

	test('a function #3 ', () => {
		const tokens = tokenizer(
			[' f = (x, y) => x + y ', ' x = f(x: 10, y: 20) '].join('\n')
		)

		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				"const f = createFunction(['x', 'y'], ({ x, y }) => x + y)",
				"const x = f([{ type: 'NamedParameter', name: 'x', value: 10 }, { type: 'NamedParameter', name: 'y', value: 20 }])"
			].join('\n')
		)
	})

	test('a function #4 ', () => {
		const tokens = tokenizer(`
			f = (x, y) => x / y
			x = f(y: 2, x: 4)
		`)

		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				"const f = createFunction(['x', 'y'], ({ x, y }) => x / y)",
				"const x = f([{ type: 'NamedParameter', name: 'y', value: 2 }, { type: 'NamedParameter', name: 'x', value: 4 }])"
			].join('\n')
		)
	})

	test('a function #5', () => {
		const tokens = tokenizer(`
			f = (x, y) => x / y
			x = f(y: 2, 4)
		`)

		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				"const f = createFunction(['x', 'y'], ({ x, y }) => x / y)",
				"const x = f([{ type: 'NamedParameter', name: 'y', value: 2 }, 4])"
			].join('\n')
		)
	})

	test('a function #6', () => {
		const tokens = tokenizer(`
			f = (x, y) => x / y
			x = f(4, y: 2)
		`)

		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				"const f = createFunction(['x', 'y'], ({ x, y }) => x / y)",
				"const x = f([4, { type: 'NamedParameter', name: 'y', value: 2 }])"
			].join('\n')
		)
	})

	test('Auto currying #1', () => {
		const tokens = tokenizer(`
			f = (x, y, z) => x + y + z
			a = f(y: 10)
			b = a(z: 100)
			c = b(1)
		`)

		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				"const f = createFunction(['x', 'y', 'z'], ({ x, y, z }) => x + y + z)",
				"const a = f([{ type: 'NamedParameter', name: 'y', value: 10 }])",
				"const b = a([{ type: 'NamedParameter', name: 'z', value: 100 }])",
				'const c = b([1])'
			].join('\n')
		)
	})

	test('Pattern matching booleans #1', () => {
		const tokens = tokenizer('match true | true -> 1 | false -> 0')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				'match(true, [',
				'{ pattern: true, result: () => 1 },',
				'{ pattern: false, result: () => 0 }',
				'])'
			].join('\n')
		)
	})

	test('Pattern matching booleans #2', () => {
		const tokens = tokenizer('match false | true -> 1 | false -> 0')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				'match(false, [',
				'{ pattern: true, result: () => 1 },',
				'{ pattern: false, result: () => 0 }',
				'])'
			].join('\n')
		)
	})

	test('Pattern matching no pattern #1', () => {
		const tokens = tokenizer('match false | true -> 1 | _ -> 0')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				'match(false, [',
				'{ pattern: true, result: () => 1 },',
				"{ pattern: { type: 'NoPattern' }, result: () => 0 }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching number pattern #1', () => {
		const tokens = tokenizer('match 1 | 0 -> 1 | 1 -> 2 | _ -> 3')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				'match(1, [',
				'{ pattern: 0, result: () => 1 },',
				'{ pattern: 1, result: () => 2 },',
				"{ pattern: { type: 'NoPattern' }, result: () => 3 }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching any pattern #1', () => {
		const tokens = tokenizer('match 1 | 0 -> 1 | n -> n')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				'match(1, [',
				'{ pattern: 0, result: () => 1 },',
				"{ pattern: { type: 'IdentifierExpression', name: 'n' }, result: ({ n }) => n }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching array pattern #2', () => {
		const tokens = tokenizer('match [] | [] -> 0 | [x, ...xs] -> x')
		const nodes = parse(tokens)
		const result = transpile(nodes[0])
		expect(result).toEqual(
			[
				'match([], [',
				'{ pattern: [], result: () => 0 },',
				"{ pattern: [ { type: 'IdentifierExpression', name: 'x' }, { type: 'RestElement', value: { name: 'xs' } } ], result: ({ x, xs }) => x }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching array pattern #3', () => {
		const tokens = tokenizer('match [ 1 ] | [] -> 0 | [ x ] -> x')
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match([ 1 ], [',
				'{ pattern: [], result: () => 0 },',
				"{ pattern: [ { type: 'IdentifierExpression', name: 'x' } ], result: ({ x }) => x }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching array pattern #4', () => {
		const tokens = tokenizer('match [ 1, 2 ] | [] -> 0 | [ x, y ] -> x + y')
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match([ 1, 2 ], [',
				'{ pattern: [], result: () => 0 },',
				"{ pattern: [ { type: 'IdentifierExpression', name: 'x' }, { type: 'IdentifierExpression', name: 'y' } ], result: ({ x, y }) => x + y }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching array pattern #5', () => {
		const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, y ] -> x + y | _ -> 10')
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match([ 1, 2, 3 ], [',
				"{ pattern: [ { type: 'IdentifierExpression', name: 'x' }, { type: 'IdentifierExpression', name: 'y' } ], result: ({ x, y }) => x + y },",
				"{ pattern: { type: 'NoPattern' }, result: () => 10 }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching array pattern with a rest element #1', () => {
		const tokens = tokenizer('match [ 1, 2, 3 ] | [ x, ...xs ] -> x')
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match([ 1, 2, 3 ], [',
				"{ pattern: [ { type: 'IdentifierExpression', name: 'x' }, { type: 'RestElement', value: { name: 'xs' } } ], result: ({ x, xs }) => x }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching object pattern #1', () => {
		const tokens = tokenizer('match {} | {} -> 0')
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match({}, [',
				'{ pattern: ObjectExpression([]), result: () => 0 }',
				'])'
			].join('\n')
		)
	})

	test('Pattern matching object pattern #2', () => {
		const tokens = tokenizer('match { x: 1 } | {} -> 0 | { x } -> x')
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match({ x: 1 }, [',
				'{ pattern: ObjectExpression([]), result: () => 0 },',
				"{ pattern: ObjectExpression([ { type: 'IdentifierExpression', name: 'x' } ]), result: ({ x }) => x }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching object pattern #3', () => {
		const tokens = tokenizer(
			'match { x: 1, y: 10 } | {} -> 0 | { x } -> x | { x, y } -> x + y'
		)
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match({ x: 1, y: 10 }, [',
				'{ pattern: ObjectExpression([]), result: () => 0 },',
				"{ pattern: ObjectExpression([ { type: 'IdentifierExpression', name: 'x' } ]), result: ({ x }) => x },",
				"{ pattern: ObjectExpression([ { type: 'IdentifierExpression', name: 'x' }, { type: 'IdentifierExpression', name: 'y' } ]), result: ({ x, y }) => x + y }",
				'])'
			].join('\n')
		)
	})

	test('Pattern matching object pattern with a rest element #1', () => {
		const tokens = tokenizer(
			'match { x: 1, y: 10 } | {} -> 0 | { x, ...xs } -> xs'
		)
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			[
				'match({ x: 1, y: 10 }, [',
				'{ pattern: ObjectExpression([]), result: () => 0 },',
				"{ pattern: ObjectExpression([ { type: 'IdentifierExpression', name: 'x' }, { type: 'RestElement', value: { name: 'xs' } } ]), result: ({ x, xs }) => xs }",
				'])'
			].join('\n')
		)
	})

	test('let expression #1', () => {
		const tokens = tokenizer(`
			let x = 1
					y = 10
			in x + y
		`)
		const nodes = parse(tokens)
		const result = transpile(nodes[0].nodes[0])
		expect(result).toEqual(
			['(() => {', 'const x = 1', 'const y = 10', 'return x + y', '})()'].join(
				'\n'
			)
		)
	})

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
