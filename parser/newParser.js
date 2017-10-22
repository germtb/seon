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
	ArrayExpression
} from './newNodes'
import { Production } from './Production'
import { arrayOf } from './utils'

const unaryOperators = ['!', 'TypeOperator']
const binaryOperators = [
	'+',
	'*',
	'/',
	'-',
	'%',
	'**',
	'<',
	'>',
	'>=',
	'<=',
	'==',
	'!=',
	'&&',
	'||'
]

const operatorPrecedence = {
	TypeOperator: ['(', '.'],
	'!': ['(', '.'],
	'**': ['!', '(', '.'],
	'*': ['!', '(', '.', '**'],
	'/': ['!', '(', '.', '**'],
	'%': ['!', '(', '.', '**'],
	'+': ['!', '(', '.', '**', '*', '%', '/'],
	'-': ['!', '(', '.', '**', '*', '%', '/'],
	'<': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'>': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'>=': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'<=': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'==': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'!=': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'&&': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'||': ['!', '(', '.', '**', '*', '%', '/', '+', '-']
}

const grammar = [
	// Terminals
	...unaryOperators.map(o => new Production([o], () => new UnaryOperator(o))),
	...binaryOperators.map(o => new Production([o], () => new BinaryOperator(o))),
	new Production(
		['Identifier'],
		identifier => new IdentifierExpression(identifier.value)
	),
	new Production(
		['Boolean'],
		expression => new BooleanExpression(expression.value)
	),
	new Production(
		['String'],
		expression => new StringExpression(expression.value)
	),
	new Production(
		['Number'],
		expression => new NumberExpression(expression.value)
	),

	// Operators
	new Production(
		['Expression', 'BinaryOperator', 'Expression'],
		(left, op, right) => new BinaryExpression(left, op, right),
		(peek, _, op) => !operatorPrecedence[op.operator].includes(peek)
	),
	new Production(
		['UnaryOperator', 'Expression'],
		(op, expression) => new UnaryExpression(op, expression),
		(peek, op) => !operatorPrecedence[op.operator].includes(peek)
	),

	// Arrays
	new Production(['[', ']'], () => new ArrayExpression([])),
	new Production(
		['[', 'Expression', ']'],
		(_, expression) => new ArrayExpression([expression])
	),
	new Production(['[', 'Expression', ','], (a, expression) =>
		arrayOf('Expression', [expression])
	),
	new Production(
		['[Expression]', 'Expression', ','],
		(expressions, expression) =>
			arrayOf('Expression', [...expressions.values, expression])
	),
	new Production(
		['[Expression]', 'Expression', ']'],
		(expressions, expression) =>
			new ArrayExpression([...expressions.values, expression])
	),

	// Obejcts

	// Patterns

	// PatternExpressions

	// Functions

	// FunctionCalls

	// File
	new Production(['Node', '$'], statement => new File([statement])),
	new Production(
		['Node', 'File'],
		(statement, file) => new File([statement, ...file.nodes])
	)
]

const parse = tokens => {
	tokens.push({ type: '$' })
	const stack = []

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i]
		const peek = i < tokens.length - 1 ? tokens[i + 1] : {}
		stack.push(token)

		for (let j = 1; j <= Math.min(5, stack.length); j++) {
			const nodes = stack.slice(stack.length - j)

			const production = grammar.find(r => r.matches(nodes, peek.type))

			if (production) {
				const tokens = stack.splice(stack.length - j)
				const node = production.generator(...tokens)
				stack.push(...[].concat(node))
				j = 0
			}
		}
	}

	return stack
}

export default parse
