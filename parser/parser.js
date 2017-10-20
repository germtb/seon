import {
	Node,
	File,
	Expression,
	Statement,
	IdentifierExpression,
	BooleanExpression,
	NumberExpression,
	StringExpression,
	ObjectExpression,
	ObjectProperty,
	ObjectAccessExpression,
	ArrayExpression,
	FunctionExpression,
	BlockStatement,
	Parameter,
	CallExpression,
	Declaration,
	BinaryExpression,
	BinaryOperator,
	UnaryExpression,
	UnaryOperator,
	PatternMatchingCase,
	PatternMatchingExpression,
	ArrayAccessExpression,
	AnyPattern,
	NumberPattern,
	BooleanPattern,
	StringPattern,
	RestElement,
	ArrayPattern,
	ObjectPattern,
	NoPattern
} from './nodes'

import { Production } from './Production'

const unaryOperators = ['!', 'type']

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

const operators = [...unaryOperators, ...binaryOperators, '.', '(', '=>']

const precedence = {
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

const arrayOf = <T>(
	type: string,
	values: Array<T>
): { type: string, values: Array<T> } => ({
	type: `[${type}]`,
	values
})

const grammar = [
	// Terminals
	...binaryOperators.map(o => new Production([o], () => new BinaryOperator(o))),
	...unaryOperators.map(o => new Production([o], () => new UnaryOperator(o))),
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

	// Objects
	new Production(
		['{', 'IdentifierExpression', ':', 'Expression'],
		(a, identifier, b, expression) => [
			{ type: '{' },
			arrayOf('ObjectProperty', [
				new ObjectProperty(identifier.name, expression)
			])
		],
		peek => !operators.includes(peek)
	),
	new Production(
		['[ObjectProperty]', ',', 'IdentifierExpression', ':', 'Expression'],
		(identifiers, a, identifier, b, expression) =>
			arrayOf('ObjectProperty', [
				...identifiers.values,
				new ObjectProperty(identifier.name, expression)
			]),
		peek => !operators.includes(peek)
	),
	new Production(
		['{', '[ObjectProperty]', '}'],
		(a, identifiers, b, c, expression) =>
			new ObjectExpression(identifiers.values)
	),
	new Production(
		['{', '}'],
		(a, identifiers, b, c, expression) => new ObjectExpression([])
	),

	new Production(
		['Expression', '.', 'IdentifierExpression'],
		(expression, c, identifier) =>
			new ObjectAccessExpression(expression, identifier.name)
	),

	// Arrays
	new Production(
		['[', 'Expression'],
		(a, expression) => [{ type: '[' }, arrayOf('Expression', [expression])],
		peek => !operators.includes(peek)
	),
	new Production(
		['[Expression]', ',', 'Expression'],
		(expressions, a, expression) =>
			arrayOf('Expression', [...expressions.values, expression]),
		peek => !operators.includes(peek)
	),
	new Production(
		['[', '[Expression]', ']'],
		(a, expressions, b) => new ArrayExpression(expressions.values)
	),
	new Production(['[', ']'], () => new ArrayExpression([])),

	// Operators
	new Production(
		['Expression', 'BinaryOperator', 'Expression'],
		(left, binaryOperator, right) =>
			new BinaryExpression(left, right, binaryOperator),
		(peek, a, binaryOperator) =>
			!precedence[binaryOperator.operator].includes(peek)
	),
	new Production(
		['UnaryOperator', 'Expression'],
		(unaryOperator, expression) =>
			new UnaryExpression(unaryOperator, expression),
		(peek, unaryOperator) => !precedence[unaryOperator.operator].includes(peek)
	),

	// FunctionExpression
	new Production(
		['(', 'IdentifierExpression'],
		(a, identifier) => [
			{ type: '(' },
			arrayOf('IdentifierExpression', [identifier])
		],
		peek => peek !== ':'
	),
	new Production(
		['[IdentifierExpression]', ',', 'IdentifierExpression'],
		(identifiers, a, identifier, b) =>
			arrayOf('IdentifierExpression', [...identifiers.values, identifier])
	),
	new Production(
		['(', '[IdentifierExpression]', ')', '=>', 'Expression'],
		(a, identifiers, b, c, expression) =>
			new FunctionExpression(identifiers.values.map(x => x.name), expression),
		peek => !operators.includes(peek)
	),
	new Production(
		['IdentifierExpression', '=>', 'Expression'],
		(identifier, b, expression) =>
			new FunctionExpression([identifier.name], expression),
		peek => !operators.includes(peek)
	),

	new Production(
		['NoPattern', '=>', 'Expression'],
		(a, b, expression) => new FunctionExpression([], expression),
		peek => !operators.includes(peek)
	),

	// Declaration
	new Production(
		['Pattern', '=', 'Expression'],
		(pattern, b, expression) => new Declaration(pattern, expression),
		peek => !operators.includes(peek)
	),

	// FunctionCall
	new Production(
		['(', 'IdentifierExpression', ':', 'Expression'],
		(a, identifier, b, expression) => [
			{ type: '(' },
			arrayOf('Parameter', [new Parameter(identifier.name, expression)])
		],
		peek => !operators.includes(peek)
	),
	new Production(
		['[Parameter]', ',', 'IdentifierExpression', ':', 'Expression'],
		(parameters, a, identifier, b, expression) =>
			arrayOf('Parameter', [
				...parameters.values,
				new Parameter(identifier.name, expression)
			]),
		peek => !operators.includes(peek)
	),
	new Production(
		['Expression', '(', '[Parameter]', ')'],
		(identifier, a, parameters) =>
			new CallExpression(identifier, parameters.values)
	),

	// Patterns
	new Production(['_'], () => new NoPattern()),
	new Production(['|', '_'], () => new NoPattern()),
	new Production(['IdentifierExpression', '='], identifier => [
		new AnyPattern(identifier.name),
		{ type: '=' }
	]),
	new Production(
		['|', 'IdentifierExpression'],
		(a, identifier) => [{ type: '|' }, new AnyPattern(identifier.name)],
		peek => !operators.includes(peek)
	),
	new Production(
		['|', 'NumberExpression'],
		(a, number) => [{ type: '|' }, new NumberPattern(number.value)],
		peek => !operators.includes(peek)
	),
	new Production(
		['|', 'BooleanExpression'],
		(a, boolean) => [{ type: '|' }, new BooleanPattern(boolean.value)],
		peek => !operators.includes(peek)
	),
	new Production(
		['|', 'StringExpression'],
		(a, string) => [{ type: '|' }, new StringPattern(string.value)],
		peek => !operators.includes(peek)
	),
	new Production(
		['|', 'ArrayExpression'],
		(a, array) => [{ type: '|' }, new ArrayPattern(array.value)],
		peek => !operators.includes(peek)
	),
	new Production(
		['|', 'ObjectExpression'],
		(a, object) => [{ type: '|' }, new ObjectPattern(object.properties)],
		peek => !operators.includes(peek)
	),
	new Production(
		['...', 'Expression'],
		(a, identifier) => new RestElement(identifier.name),
		peek => peek !== '.' && peek !== '[' && peek !== '('
	),

	// PatternMatchingExpression
	new Production(
		['|', 'Pattern', '->', 'Expression'],
		(a, pattern, c, result) => new PatternMatchingCase(pattern, result),
		peek => !operators.includes(peek)
	),
	new Production(
		['PatternMatchingCase'],
		pattern => new PatternMatchingExpression([pattern]),
		peek => !operators.includes(peek) && peek !== '|'
	),
	new Production(
		['PatternMatchingCase', 'PatternMatchingExpression'],
		(patternCase, expression) =>
			new PatternMatchingExpression([patternCase, ...expression.cases]),
		peek => !operators.includes(peek) && peek !== '|'
	),

	// File
	new Production(['Node', '$'], statement => new File([statement])),
	new Production(
		['Node', 'File'],
		(statement, file) => new File([statement, ...file.nodes])
	)
]

type Terminal = { type: string }
type Nonterminal = Node

const parse = (
	tokens: Array<Terminal | Nonterminal>
): Array<Terminal | Nonterminal> => {
	tokens.push({ type: '$' })
	const stack: Array<Terminal | Nonterminal> = []

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
