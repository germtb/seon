import tokenizer from '../tokenizer/tokenizer'
import parse, {
	NumberExpression,
	BinaryExpression,
	BinaryOperator
} from './parser'

describe('parser', () => {
	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		expect(nodes).toEqual(new NumberExpression(1234))
	})

	test('converts a +', () => {
		const tokens = tokenizer('1234 + 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual(
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('+')
			)
		)
	})

	test('converts a *', () => {
		const tokens = tokenizer('1234 * 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual(
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('*')
			)
		)
	})

	test('converts a /', () => {
		const tokens = tokenizer('1234 / 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual(
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('/')
			)
		)
	})

	test('converts a -', () => {
		const tokens = tokenizer('1234 - 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual(
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('-')
			)
		)
	})

	test('converts a -', () => {
		const tokens = tokenizer('1234 - 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual(
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('-')
			)
		)
	})

	test('converts a ==', () => {
		const tokens = tokenizer('1234 == 3')
		const nodes = parse(tokens)
		expect(nodes).toEqual(
			new BinaryExpression(
				new NumberExpression(1234),
				new NumberExpression(3),
				new BinaryOperator('==')
			)
		)
	})
})
