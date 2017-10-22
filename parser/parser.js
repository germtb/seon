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
	AnyPattern,
	NumberPattern,
	BooleanPattern,
	StringPattern,
	ArrayPattern,
	ObjectPattern,
	NoPattern,
	PatternCase,
	PatternExpression,
	Declaration
} from './nodes'
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
	'||',
	'|>'
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
	'||': ['!', '(', '.', '**', '*', '%', '/', '+', '-'],
	'|>': ['!', '(', '.', '**', '*', '%', '/', '+', '-']
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
		['{', 'IdentifierExpression|NamedParameter|RestElement', '}'],
		(_, identifier) => new ObjectExpression([new ObjectProperty(identifier)])
	),
	new Production(
		['{', 'IdentifierExpression|NamedParameter|RestElement', ','],
		(_, expression) =>
			arrayOf('ObjectProperty', [new ObjectProperty(expression)])
	),
	new Production(
		[
			'[ObjectProperty]',
			'IdentifierExpression|NamedParameter|RestElement',
			','
		],
		(expressions, expression) =>
			arrayOf('ObjectProperty', [
				...expressions.values,
				new ObjectProperty(expression)
			])
	),
	new Production(
		[
			'[ObjectProperty]',
			'IdentifierExpression|NamedParameter|RestElement',
			'}'
		],
		(expressions, expression) =>
			new ObjectExpression([
				...expressions.values,
				new ObjectProperty(expression)
			])
	),

	// NamedParameters
	new Production(
		['IdentifierExpression', ':', 'Expression'],
		(identifier, _, expression) =>
			new NamedParameter(identifier.name, expression),
		lowestPrecedence
	),

	// RestElement
	new Production(
		['...', 'Expression'],
		(a, identifier) => new RestElement(identifier.name),
		lowestPrecedence
	),

	// PatternExpressions
	new Production(
		['PatternExpression', 'PatternCase'],
		(patternExpression, patternCase) =>
			new PatternExpression(patternExpression.expressions, [
				...patternExpression.patternCases,
				patternCase
			])
	),
	new Production(
		['Expression', 'PatternCase'],
		(expression, patternCase) =>
			new PatternExpression([expression], [patternCase])
	),

	// Begin pattern
	new Production(['|', '_', ',|->'], () =>
		arrayOf('Pattern', [new NoPattern()])
	),
	new Production(['|', 'IdentifierExpression', ',|->'], (_, identifier) =>
		arrayOf('Pattern', [new AnyPattern(identifier.name)])
	),
	new Production(['|', 'BooleanExpression', ',|->'], (_, boolean) =>
		arrayOf('Pattern', [new BooleanPattern(boolean.value)])
	),
	new Production(['|', 'NumberExpression', ',|->'], (_, number) =>
		arrayOf('Pattern', [new NumberPattern(number.value)])
	),
	new Production(['|', 'StringExpression', ',|->'], (_, string) =>
		arrayOf('Pattern', [new StringPattern(string.value)])
	),
	new Production(['|', 'ArrayExpression', ',|->'], (_, array) =>
		arrayOf('Pattern', [new ArrayPattern(array)])
	),
	new Production(['|', 'ObjectExpression', ',|->'], (_, obj) =>
		arrayOf('Pattern', [new ObjectPattern(obj)])
	),

	// Concatenate patterns
	new Production(['[Pattern]', '_', ',|->'], (patterns, boolean) =>
		arrayOf('Pattern', [...patterns.values, new BooleanPattern(boolean.value)])
	),
	new Production(
		['[Pattern]', 'IdentifierExpression', ',|->'],
		(patterns, identifier) =>
			arrayOf('Pattern', [...patterns.values, new AnyPattern(identifier.name)])
	),
	new Production(
		['[Pattern]', 'BooleanExpression', ',|->'],
		(patterns, boolean) =>
			arrayOf('Pattern', [
				...patterns.values,
				new BooleanPattern(boolean.value)
			])
	),
	new Production(
		['[Pattern]', 'NumberExpression', ',|->'],
		(patterns, number) =>
			arrayOf('Pattern', [...patterns.values, new NumberPattern(number.value)])
	),
	new Production(
		['[Pattern]', 'StringExpression', ',|->'],
		(patterns, string) =>
			arrayOf('Pattern', [...patterns.values, new StringPattern(string.value)])
	),
	new Production(['[Pattern]', 'ArrayExpression', ',|->'], (patterns, array) =>
		arrayOf('Pattern', [...patterns.values, new ArrayPattern(array)])
	),
	new Production(['[Pattern]', 'ObjectExpression', ',|->'], (patterns, obj) =>
		arrayOf('Pattern', [...patterns.values, new ObjectPattern(obj)])
	),

	new Production(
		['[Pattern]', 'Expression'],
		(patterns, expression) => new PatternCase(patterns.values, expression),
		peek => lowestPrecedence(peek) && peek !== ',' && peek !== '->'
	),

	// Functions
	new Production(
		['IdentifierExpression', '=>', 'Expression'],
		(identifier, _, body) => new FunctionExpression([identifier], body),
		lowestPrecedence
	),
	new Production(
		['(', ')', '=>', 'Expression'],
		(_, __, ___, body) => new FunctionExpression([], body),
		lowestPrecedence
	),
	new Production(
		['(', 'IdentifierExpression|NamedParameter|RestElement', ','],
		(_, parameter) => arrayOf('Parameter', [parameter])
	),
	new Production(
		['(', 'IdentifierExpression|NamedParameter|RestElement', ')'],
		(_, parameter) => ({
			type: 'ClosedParameters',
			values: [parameter]
		})
	),

	new Production(
		['[Parameter]', 'IdentifierExpression|NamedParameter|RestElement', ','],
		(parameters, parameter) =>
			arrayOf('Parameter', [...parameters.values, parameter])
	),
	new Production(
		['[Parameter]', 'IdentifierExpression|NamedParameter|RestElement', ')'],
		(parameters, parameter) => ({
			type: 'ClosedParameters',
			values: [...parameters.values, parameter]
		})
	),
	new Production(
		['ClosedParameters', '=>', 'Expression'],
		(parameters, _, body) => new FunctionExpression(parameters.values, body),
		lowestPrecedence
	),

	// FunctionCalls
	new Production(
		['Expression', 'ClosedParameters'],
		(expression, parameters) =>
			new CallExpression(expression, parameters.values),
		lowestPrecedence
	),

	// Declarations
	new Production(
		['ArrayExpression', '=', 'Expression'],
		(array, _, expression) =>
			new Declaration(new ArrayPattern(array), expression),
		lowestPrecedence
	),
	new Production(
		['ObjectExpression', '=', 'Expression'],
		(obj, _, expression) => new Declaration(new ObjectPattern(obj), expression),
		lowestPrecedence
	),
	new Production(
		['IdentifierExpression', '=', 'Expression'],
		(identifier, _, expression) => new Declaration(identifier, expression),
		lowestPrecedence
	),

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
