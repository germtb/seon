import tokenizer from '../tokenizer/tokenizer'
import parse from './parser'
import {
	File,
	ObjectExpression,
	ObjectProperty,
	ObjectAccessExpression,
	ArrayExpression,
	UnaryOperator,
	BooleanExpression,
	UnaryExpression,
	IdentifierExpression,
	NumberExpression,
	BinaryExpression,
	BinaryOperator,
	FunctionExpression,
	Parameter,
	CallExpression,
	Declaration,
	PatternMatchingCase,
	PatternMatchingDefault,
	PatternMatchingExpression
} from './nodes'

describe('parser', () => {
	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new NumberExpression(1234)])])
	})

	test('converts a unary expression', () => {
		const tokens = tokenizer('!true')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new UnaryExpression(new UnaryOperator('!'), new BooleanExpression(true))
			])
		])
	})

	test('converts a binary expression', () => {
		const tokens = tokenizer('1234 + 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new BinaryExpression(
					new NumberExpression(1234),
					new NumberExpression(3),
					new BinaryOperator('+')
				)
			])
		])
	})

	test('converts a function without parameters', () => {
		const tokens = tokenizer('_ => 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new FunctionExpression([], new NumberExpression(10))])
		])
	})

	test('converts a function with one parameter', () => {
		const tokens = tokenizer('(x) => 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new FunctionExpression(['x'], new NumberExpression(10))])
		])
	})

	test('converts a function with two parameters', () => {
		const tokens = tokenizer('(x, y) => 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new FunctionExpression(['x', 'y'], new NumberExpression(10))])
		])
	})

	test('converts a function call', () => {
		const tokens = tokenizer('f(x: 10)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression(new IdentifierExpression('f'), [
					new Parameter('x', new NumberExpression(10))
				])
			])
		])
	})

	test('converts a function call with two parameters', () => {
		const tokens = tokenizer('f(x: 10, y: 50)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression(new IdentifierExpression('f'), [
					new Parameter('x', new NumberExpression(10)),
					new Parameter('y', new NumberExpression(50))
				])
			])
		])
	})

	test('converts a declaration', () => {
		const tokens = tokenizer('x = 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new Declaration('x', new NumberExpression(10))])
		])
	})

	test('converts several declarations', () => {
		const tokens = tokenizer(`
			x = 10
			y = 20
			z = 30
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration('x', new NumberExpression(10)),
				new Declaration('y', new NumberExpression(20)),
				new Declaration('z', new NumberExpression(30))
			])
		])
	})

	test('converts a pattern case', () => {
		const tokens = tokenizer('| 10 -> 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternMatchingCase(
					new NumberExpression(10),
					new NumberExpression(10)
				)
			])
		])
	})

	test('converts a default pattern case', () => {
		const tokens = tokenizer('| _ -> 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new PatternMatchingDefault(new NumberExpression(10))])
		])
	})

	test('converts a pattern expression', () => {
		const tokens = tokenizer('| 5 -> 10 | 10 -> 10 | _ -> 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternMatchingExpression(
					[
						new PatternMatchingCase(
							new NumberExpression(5),
							new NumberExpression(10)
						),
						new PatternMatchingCase(
							new NumberExpression(10),
							new NumberExpression(10)
						)
					],
					new PatternMatchingDefault(new NumberExpression(3))
				)
			])
		])
	})

	test('functions with one parameter do not need parenthesis', () => {
		const tokens = tokenizer(`
			f = n => 0
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					'f',
					new FunctionExpression(['n'], new NumberExpression(0))
				)
			])
		])
	})

	test('converts a function declaration', () => {
		const tokens = tokenizer(`
			f = (n) => 0
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					'f',
					new FunctionExpression(['n'], new NumberExpression(0))
				)
			])
		])
	})

	test('converts a function with a body with expression of expressions', () => {
		const tokens = tokenizer('(n) => n + n')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new FunctionExpression(
					['n'],
					new BinaryExpression(
						new IdentifierExpression('n'),
						new IdentifierExpression('n'),
						new BinaryOperator('+')
					)
				)
			])
		])
	})

	test('converts correct precedence', () => {
		const tokens = tokenizer('1 * 2 + 3 * 4')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new BinaryExpression(
					new BinaryExpression(
						new NumberExpression(1),
						new NumberExpression(2),
						new BinaryOperator('*')
					),
					new BinaryExpression(
						new NumberExpression(3),
						new NumberExpression(4),
						new BinaryOperator('*')
					),
					new BinaryOperator('+')
				)
			])
		])
	})

	test('converts a file', () => {
		const tokens = tokenizer(`
			x = 10
			y = 100
			area = x * y
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration('x', new NumberExpression(10)),
				new Declaration('y', new NumberExpression(100)),
				new Declaration(
					'area',
					new BinaryExpression(
						new IdentifierExpression('x'),
						new IdentifierExpression('y'),
						new BinaryOperator('*')
					)
				)
			])
		])
	})

	test('converts an object expression', () => {
		const tokens = tokenizer('{ x: 100 }')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ObjectExpression([
					new ObjectProperty('x', new NumberExpression(100))
				])
			])
		])
	})

	test('converts an object access expression', () => {
		const tokens = tokenizer('x.hello')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ObjectAccessExpression(new IdentifierExpression('x'), 'hello')
			])
		])
	})

	test('converts an array expression', () => {
		const tokens = tokenizer('[ 1, 2 ]')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ArrayExpression([new NumberExpression(1), new NumberExpression(2)])
			])
		])
	})

	test('converts fibonacci', () => {
		const tokens = tokenizer(`
			fib = n =>
				| 1 -> 1
				| 2 -> 1
				| _ -> fib(n: n - 1) + fib(n: n - 2)
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					'fib',
					new FunctionExpression(
						['n'],
						new PatternMatchingExpression(
							[
								new PatternMatchingCase(
									new NumberExpression(1),
									new NumberExpression(1)
								),
								new PatternMatchingCase(
									new NumberExpression(2),
									new NumberExpression(1)
								)
							],
							new PatternMatchingDefault(
								new BinaryExpression(
									new CallExpression(new IdentifierExpression('fib'), [
										new Parameter(
											'n',
											new BinaryExpression(
												new IdentifierExpression('n'),
												new NumberExpression(1),
												new BinaryOperator('-')
											)
										)
									]),
									new CallExpression(new IdentifierExpression('fib'), [
										new Parameter(
											'n',
											new BinaryExpression(
												new IdentifierExpression('n'),
												new NumberExpression(2),
												new BinaryOperator('-')
											)
										)
									]),
									new BinaryOperator('+')
								)
							)
						)
					)
				)
			])
		])
	})
})
