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
	test('pattern expression returns pattern expression', () => {
		const tokens = tokenizer('x | true -> (0 | -> 0)')
		// const nodes = parse(tokens)
		// expect(nodes).toEqual([new File([])])
	})
})
