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
	Declaration,
	LetExpression
} from './nodes'

describe('parser', () => {
	test('pattern expression in pattern expression', () => {
		const tokens = tokenizer(`
			match true
				| true -> (match 0 | 0 -> 0 | _ -> 1)
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual(
			new File([
				new PatternExpression(new BooleanExpression(true), [
					new PatternCase(
						new BooleanExpression(true),
						new PatternExpression(new NumberExpression(0), [
							new PatternCase(new NumberExpression(0), new NumberExpression(0)),
							new PatternCase(new NoPattern(), new NumberExpression(1))
						])
					)
				])
			])
		)
	})
})
