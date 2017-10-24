import tokenizer from '../tokenizer'
import parse from './index'
import {
	File,
	UnaryOperator,
	UnaryExpression,
	BinaryOperator,
	BinaryExpression,
	IdentifierExpression,
	BooleanExpression,
	NumberExpression,
	StringExpression,
	ArrayExpression,
	RestElement,
	ObjectExpression,
	ObjectProperty,
	NamedParameter,
	FunctionExpression,
	CallExpression,
	NoPattern,
	PatternCase,
	PatternExpression,
	Declaration
} from './nodes'

describe('parser', () => {
	test('converts an identifier', () => {
		const tokens = tokenizer('x')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new IdentifierExpression('x')])])
	})

	test('converts a boolean', () => {
		const tokens = tokenizer('true')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new BooleanExpression(true)])])
	})

	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new NumberExpression(1234)])])
	})

	test('converts a string', () => {
		const tokens = tokenizer("'1234'")
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new StringExpression('1234')])])
	})

	test('converts a binary opertor', () => {
		const tokens = tokenizer('+')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new BinaryOperator('+')])])
	})

	test('converts a unary opertor', () => {
		const tokens = tokenizer('!')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new UnaryOperator('!')])])
	})

	test('converts a type opertor', () => {
		const tokens = tokenizer('type')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new UnaryOperator('TypeOperator')])])
	})

	test('converts a binary expression', () => {
		const tokens = tokenizer('10 - 5')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new BinaryExpression(
					new NumberExpression(10),
					new BinaryOperator('-'),
					new NumberExpression(5)
				)
			])
		])
	})

	test('converts a unary expression', () => {
		const tokens = tokenizer('!5')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new UnaryExpression(new UnaryOperator('!'), new NumberExpression(5))
			])
		])
	})

	test('converts a type expression', () => {
		const tokens = tokenizer('type 5')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new UnaryExpression(
					new UnaryOperator('TypeOperator'),
					new NumberExpression(5)
				)
			])
		])
	})

	test('converts with the right precedence #1', () => {
		const tokens = tokenizer('1 * 2 + 3 * 4')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new BinaryExpression(
					new BinaryExpression(
						new NumberExpression(1),
						new BinaryOperator('*'),
						new NumberExpression(2)
					),
					new BinaryOperator('+'),
					new BinaryExpression(
						new NumberExpression(3),
						new BinaryOperator('*'),
						new NumberExpression(4)
					)
				)
			])
		])
	})

	test('converts with the right precedence #2', () => {
		const tokens = tokenizer('1 ** 2 * 3 ** 4')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new BinaryExpression(
					new BinaryExpression(
						new NumberExpression(1),
						new BinaryOperator('**'),
						new NumberExpression(2)
					),
					new BinaryOperator('*'),
					new BinaryExpression(
						new NumberExpression(3),
						new BinaryOperator('**'),
						new NumberExpression(4)
					)
				)
			])
		])
	})

	test('converts an empty array', () => {
		const tokens = tokenizer('[]')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new ArrayExpression([])])])
	})

	test('converts a non-empty array #1', () => {
		const tokens = tokenizer('[0]')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new ArrayExpression([new NumberExpression(0)])])
		])
	})

	test('converts a non-empty array #2', () => {
		const tokens = tokenizer("[0, x, 'hello']")
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ArrayExpression([
					new NumberExpression(0),
					new IdentifierExpression('x'),
					new StringExpression('hello')
				])
			])
		])
	})

	test('converts a non-empty array #3', () => {
		const tokens = tokenizer('[0, x, ...y]')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ArrayExpression([
					new NumberExpression(0),
					new IdentifierExpression('x'),
					new RestElement('y')
				])
			])
		])
	})

	test('converts a rest element', () => {
		const tokens = tokenizer('...x')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new RestElement('x')])])
	})

	test('converts a parameter #1', () => {
		const tokens = tokenizer('x: 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new NamedParameter('x', new NumberExpression(10))])
		])
	})

	test('converts a parameter #2', () => {
		const tokens = tokenizer('x: 10 + 2')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new NamedParameter(
					'x',
					new BinaryExpression(
						new NumberExpression(10),
						new BinaryOperator('+'),
						new NumberExpression(2)
					)
				)
			])
		])
	})

	test('converts an empty object', () => {
		const tokens = tokenizer('{}')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new ObjectExpression([])])])
	})

	test('converts a non-empty object #1', () => {
		const tokens = tokenizer('{ x }')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ObjectExpression([
					new ObjectProperty(new IdentifierExpression('x'))
				])
			])
		])
	})

	test('converts a non-empty object #2', () => {
		const tokens = tokenizer('{ x: 10 }')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ObjectExpression([
					new ObjectProperty(new NamedParameter('x', new NumberExpression(10)))
				])
			])
		])
	})

	test('converts a non-empty object #3', () => {
		const tokens = tokenizer('{ ...x }')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ObjectExpression([new ObjectProperty(new RestElement('x'))])
			])
		])
	})

	test('converts a non-empty object #4', () => {
		const tokens = tokenizer('{ x, y: 100, ...z }')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new ObjectExpression([
					new ObjectProperty(new IdentifierExpression('x')),
					new ObjectProperty(
						new NamedParameter('y', new NumberExpression(100))
					),
					new ObjectProperty(new RestElement('z'))
				])
			])
		])
	})

	test('converts a function expression with no parameter', () => {
		const tokens = tokenizer('() => x')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new FunctionExpression([], new IdentifierExpression('x'))])
		])
	})

	test('converts a function expression with one parameter #1', () => {
		const tokens = tokenizer('x => x')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new FunctionExpression(
					[new IdentifierExpression('x')],
					new IdentifierExpression('x')
				)
			])
		])
	})

	test('converts a function expression several parameters #1', () => {
		const tokens = tokenizer('(x, y) => x + y')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new FunctionExpression(
					[new IdentifierExpression('x'), new IdentifierExpression('y')],
					new BinaryExpression(
						new IdentifierExpression('x'),
						new BinaryOperator('+'),
						new IdentifierExpression('y')
					)
				)
			])
		])
	})

	test('converts a function expression several parameters #2', () => {
		const tokens = tokenizer('(x, z: 10, ...y) => x + y')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new FunctionExpression(
					[
						new IdentifierExpression('x'),
						new NamedParameter('z', new NumberExpression(10)),
						new RestElement('y')
					],
					new BinaryExpression(
						new IdentifierExpression('x'),
						new BinaryOperator('+'),
						new IdentifierExpression('y')
					)
				)
			])
		])
	})

	test('converts a function call #1', () => {
		const tokens = tokenizer('f(x)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression(new IdentifierExpression('f'), [
					new IdentifierExpression('x')
				])
			])
		])
	})

	test('converts a function call #2', () => {
		const tokens = tokenizer('f(x: 10)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression(new IdentifierExpression('f'), [
					new NamedParameter('x', new NumberExpression(10))
				])
			])
		])
	})

	test('converts a function call #3', () => {
		const tokens = tokenizer('f(...x)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression(new IdentifierExpression('f'), [
					new RestElement('x')
				])
			])
		])
	})

	test('converts a no-pattern pattern case', () => {
		const tokens = tokenizer('| _ -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([new PatternCase([new NoPattern()], new NumberExpression(0))])
		])
	})

	test('converts an any-pattern pattern case', () => {
		const tokens = tokenizer('| x -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase(
					[new IdentifierExpression('x')],
					new NumberExpression(0)
				)
			])
		])
	})

	test('converts a boolean pattern case', () => {
		const tokens = tokenizer('| true -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase([new BooleanExpression(true)], new NumberExpression(0))
			])
		])
	})

	test('converts a number pattern case', () => {
		const tokens = tokenizer('| 0 -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase([new NumberExpression(0)], new NumberExpression(0))
			])
		])
	})

	test('converts a string pattern case', () => {
		const tokens = tokenizer("| 'hello' -> 0")
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase(
					[new StringExpression('hello')],
					new NumberExpression(0)
				)
			])
		])
	})

	test('converts an array pattern case #1', () => {
		const tokens = tokenizer('| [] -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase([new ArrayExpression([])], new NumberExpression(0))
			])
		])
	})

	test('converts an array pattern case #2', () => {
		const tokens = tokenizer('| [x, ...y] -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase(
					[
						new ArrayExpression([
							new IdentifierExpression('x'),
							new RestElement('y')
						])
					],
					new NumberExpression(0)
				)
			])
		])
	})

	test('converts an object pattern case #1', () => {
		const tokens = tokenizer('| {} -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase([new ObjectExpression([])], new NumberExpression(0))
			])
		])
	})

	test('converts an object pattern case #2', () => {
		const tokens = tokenizer('| { x, y: 10, ...z } -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase(
					[
						new ObjectExpression([
							new ObjectProperty(new IdentifierExpression('x')),
							new ObjectProperty(
								new NamedParameter('y', new NumberExpression(10))
							),
							new ObjectProperty(new RestElement('z'))
						])
					],
					new NumberExpression(0)
				)
			])
		])
	})

	test('converts multi-patterns #1', () => {
		const tokens = tokenizer('| 0, 10 -> 0')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase(
					[new NumberExpression(0), new NumberExpression(10)],
					new NumberExpression(0)
				)
			])
		])
	})

	test('converts multi-patterns #2', () => {
		const tokens = tokenizer('| _, [] -> []')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase(
					[new NoPattern(), new ArrayExpression([])],
					new ArrayExpression([])
				)
			])
		])
	})

	test('converts multi-patterns #3', () => {
		const tokens = tokenizer('| f, { x, ...xs } -> { x: f(x), ...xs }')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternCase(
					[
						new IdentifierExpression('f'),
						new ObjectExpression([
							new ObjectProperty(new IdentifierExpression('x')),
							new ObjectProperty(new RestElement('xs'))
						])
					],
					new ObjectExpression([
						new ObjectProperty(
							new NamedParameter(
								'x',
								new CallExpression(new IdentifierExpression('f'), [
									new IdentifierExpression('x')
								])
							)
						),
						new ObjectProperty(new RestElement('xs'))
					])
				)
			])
		])
	})

	test('converts a pattern expression #1', () => {
		const tokens = tokenizer('x | 0 -> false | _ -> true')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new PatternExpression(
					[new IdentifierExpression('x')],
					[
						new PatternCase(
							[new NumberExpression(0)],
							new BooleanExpression(false)
						),
						new PatternCase([new NoPattern()], new BooleanExpression(true))
					]
				)
			])
		])
	})

	test('converts a declaration #1', () => {
		const tokens = tokenizer('x = 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(new IdentifierExpression('x'), new NumberExpression(10))
			])
		])
	})

	test('converts a declaration #2', () => {
		const tokens = tokenizer('[x, ...xs] = 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					new ArrayExpression([
						new IdentifierExpression('x'),
						new RestElement('xs')
					]),
					new NumberExpression(10)
				)
			])
		])
	})

	test('converts a declaration #3', () => {
		const tokens = tokenizer('{ x, ...xs } = 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					new ObjectExpression([
						new ObjectProperty(new IdentifierExpression('x')),
						new ObjectProperty(new RestElement('xs'))
					]),
					new NumberExpression(10)
				)
			])
		])
	})

	test('converts a function declaration', () => {
		const tokens = tokenizer('f = x => x')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					new IdentifierExpression('f'),
					new FunctionExpression(
						[new IdentifierExpression('x')],
						new IdentifierExpression('x')
					)
				)
			])
		])
	})

	test('bug #1', () => {
		const tokens = tokenizer('f(10)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression(new IdentifierExpression('f'), [
					new NumberExpression(10)
				])
			])
		])
	})

	test('bug #2', () => {
		const tokens = tokenizer('f(y: 1, 1)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression(new IdentifierExpression('f'), [
					new NamedParameter('y', new NumberExpression(1)),
					new NumberExpression(1)
				])
			])
		])
	})
})
