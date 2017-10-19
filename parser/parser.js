// @flow

import {
	Node,
	File,
	Expression,
	Statement,
	IdentifierExpression,
	BooleanExpression,
	NumberExpression,
	StringExpression,
	EmptyArrayExpression,
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
	PatternMatchingDefault,
	PatternMatchingExpression,
	ArrayAccessExpression
} from './nodes'

import { Production } from './Production'

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

const unaryOperators = ['!']

const arrayOf = <T>(
	type: string,
	values: Array<T>
): { type: string, values: Array<T> } => ({
	type: `[${type}]`,
	values
})

const grammar: Array<Production> = [
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

	// Operators
	new Production(
		['Expression', 'BinaryOperator', 'Expression'],
		(left, op, right) => new BinaryExpression(left, right, op),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),
	new Production(
		['UnaryOperator', 'Expression'],
		(op, expression) => new UnaryExpression(op, expression),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),

	// FunctionExpression
	new Production(['(', 'IdentifierExpression'], (a, identifier) => [
		{ type: '(' },
		arrayOf('IdentifierExpression', [identifier])
	]),
	new Production(
		['[IdentifierExpression]', ',', 'IdentifierExpression'],
		(identifiers, a, identifier, b) => {
			return arrayOf('IdentifierExpression', [
				...identifiers.values,
				identifier
			])
		}
	),
	new Production(
		['(', '[IdentifierExpression]', ')', '=>', 'Expression'],
		(a, identifiers, b, c, expression) =>
			new FunctionExpression(identifiers.values.map(x => x.name), expression),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),
	new Production(
		['_', '=>', 'Expression'],
		(a, b, expression) => new FunctionExpression([], expression),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),

	// Declaration
	new Production(
		['IdentifierExpression', '=', 'Expression'],
		(identifier, b, expression) => new Declaration(identifier.name, expression),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),

	// FunctionCall
	new Production(
		['[IdentifierExpression]', ':', 'Expression'],
		(identifiers, a, expression) => {
			return arrayOf('Parameter', [
				new Parameter(identifiers.values[0].name, expression)
			])
		},
		peek => !binaryOperators.includes(peek) && peek !== '('
	),
	new Production(
		['IdentifierExpression', ':', 'Expression'],
		(identifier, _, expression) => new Parameter(identifier.name, expression),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),
	new Production(
		['[Parameter]', ',', 'Parameter'],
		(parameters, a, parameter) =>
			arrayOf('Parameter', [...parameters.values, parameter])
	),
	new Production(
		['IdentifierExpression', '(', '[Parameter]', ')'],
		(identifier, a, parameters) =>
			new CallExpression(identifier.name, parameters.values)
	),

	// PatternMatchingExpression
	new Production(
		['|', '_', '->', 'Expression'],
		(a, b, c, result) => new PatternMatchingDefault(result),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),
	new Production(
		['|', 'Expression', '->', 'Expression'],
		(a, pattern, b, result) => new PatternMatchingCase(pattern, result),
		peek => !binaryOperators.includes(peek) && peek !== '('
	),
	new Production(
		['PatternMatchingCase', 'PatternMatchingDefault'],
		(casePattern, defaultPattern) =>
			new PatternMatchingExpression([casePattern], defaultPattern)
	),
	new Production(
		['PatternMatchingCase', 'PatternMatchingExpression'],
		(patternMatchingCase, patternMatchingExpression) => {
			return new PatternMatchingExpression(
				[patternMatchingCase, ...patternMatchingExpression.casePatterns],
				patternMatchingExpression.defaultPattern
			)
		}
	),

	// File
	new Production(['Node', '$'], statement => {
		return new File([statement])
	}),
	new Production(['Node', 'File'], (statement, file) => {
		return new File([statement, ...file.nodes])
	})
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
			const nodes = stack.slice(stack.length - j).map(r => r.type)

			const production = grammar.find(r => {
				return r.matches(nodes, peek.type)
			})

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
