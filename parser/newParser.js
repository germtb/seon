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
	Parameter
} from './newNodes'
import { Production } from './Production'
import { arrayOf } from './utils'

const nonOperators = ['(', '.', '[', '{']
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

const lowestPrecedence = peek =>
	!nonOperators.includes(peek) &&
	!unaryOperators.includes(peek) &&
	!binaryOperators.includes(peek)

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
		['[', 'Expression|RestElement', ']'],
		(_, expression) => new ArrayExpression([expression])
	),
	new Production(['[', 'Expression|RestElement', ','], (_, expression) =>
		arrayOf('Expression', [expression])
	),
	new Production(
		['[Expression]', 'Expression|RestElement', ','],
		(expressions, expression) =>
			arrayOf('Expression', [...expressions.values, expression])
	),
	new Production(
		['[Expression]', 'Expression|RestElement', ']'],
		(expressions, expression) =>
			new ArrayExpression([...expressions.values, expression])
	),

	// Obejcts
	new Production(['{', '}'], () => new ObjectExpression([])),
	new Production(
		['{', 'IdentifierExpression|Parameter|RestElement', '}'],
		(_, identifier) => new ObjectExpression([new ObjectProperty(identifier)])
	),
	new Production(
		['{', 'IdentifierExpression|Parameter|RestElement', ','],
		(_, expression) =>
			arrayOf('ObjectProperty', [new ObjectProperty(expression)])
	),
	new Production(
		['[ObjectProperty]', 'IdentifierExpression|Parameter|RestElement', ','],
		(expressions, expression) =>
			arrayOf('ObjectProperty', [
				...expressions.values,
				new ObjectProperty(expression)
			])
	),
	new Production(
		['[ObjectProperty]', 'IdentifierExpression|Parameter|RestElement', '}'],
		(expressions, expression) =>
			new ObjectExpression([
				...expressions.values,
				new ObjectProperty(expression)
			])
	),

	// Parameters
	new Production(
		['IdentifierExpression', ':', 'Expression'],
		(identifier, _, expression) => new Parameter(identifier.name, expression),
		lowestPrecedence
	),

	// RestElement
	new Production(
		['...', 'Expression'],
		(a, identifier) => new RestElement(identifier.name),
		peek => peek !== '.' && peek !== '[' && peek !== '('
	),

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
