import tokenizer from '../tokenizer/tokenizer'
import parse, {
	NumberExpression,
	BinaryExpression,
	BinaryOperator,
	FunctionExpression,
	Parameter,
	CallExpression
} from './parser'

describe('parser', () => {
	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		expect(nodes).toEqual([new NumberExpression(1234)])
	})

	test('converts a +', () => {
		const tokens = tokenizer('1234 + 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('+')
			)
		])
	})

	test('converts a *', () => {
		const tokens = tokenizer('1234 * 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('*')
			)
		])
	})

	test('converts a /', () => {
		const tokens = tokenizer('1234 / 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('/')
			)
		])
	})

	test('converts a -', () => {
		const tokens = tokenizer('1234 - 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('-')
			)
		])
	})

	test('converts a -', () => {
		const tokens = tokenizer('1234 - 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('-')
			)
		])
	})

	test('converts a ==', () => {
		const tokens = tokenizer('1234 == 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('==')
			)
		])
	})

	test('converts a function without parameters', () => {
		const tokens = tokenizer('_ => 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new FunctionExpression([], new NumberExpression(10))
		])
	})

	test('converts a function with one parameter', () => {
		const tokens = tokenizer('x => 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new FunctionExpression(['x'], new NumberExpression(10))
		])
	})

	test('converts a function with one parameter', () => {
		const tokens = tokenizer('x y => 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new FunctionExpression(['x', 'y'], new NumberExpression(10))
		])
	})

	test('converts a parameter to an array of parameters', () => {
		const tokens = tokenizer('x: 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			{
				type: '[Parameter]',
				values: [new Parameter('x', new NumberExpression(10))]
			}
		])
	})

	test('converts a function call', () => {
		const tokens = tokenizer('f x: 10')
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new CallExpression('f', [new Parameter('x', new NumberExpression(10))])
		])
	})
})
