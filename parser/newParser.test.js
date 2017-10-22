import tokenizer from '../tokenizer/tokenizer'
import parse from './newParser'
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
	RestElement
} from './newNodes'

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
})
