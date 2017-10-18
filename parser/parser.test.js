import tokenizer from '../tokenizer/tokenizer'
import parse, {
	File,
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
} from './parser'

describe('parser', () => {
	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new File([new NumberExpression(1234)])])
	})

	test('converts a +', () => {
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

	test('converts a ==', () => {
		const tokens = tokenizer('1234 == 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new BinaryExpression(
					new NumberExpression(1234),
					new NumberExpression(3),
					new BinaryOperator('==')
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
				new CallExpression('f', [new Parameter('x', new NumberExpression(10))])
			])
		])
	})

	test('converts a function call with two parameters', () => {
		const tokens = tokenizer('f(x: 10, y: 50)')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new CallExpression('f', [
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
})
