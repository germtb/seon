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
	ObjectAccessExpression,
	NamedParameter,
	FunctionExpression,
	CallExpression,
	NoPattern,
	PatternCase,
	PatternExpression,
	Declaration,
	ImportDeclaration,
	LetExpression
} from './nodes'
import { Production } from './Production'
import { arrayOf } from './utils'

const nonOperators = ['[', '{', '=>', '(', 'match', '.']
const unaryOperators = ['not', '-']
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
	'and',
	'or',
	'|>'
]

const lowestPrecedence = peek =>
	!nonOperators.includes(peek) &&
	!unaryOperators.includes(peek) &&
	!binaryOperators.includes(peek)

const functionExpressionPrecedence = peek =>
	lowestPrecedence(peek) && peek !== '|'

const unaryOperatorPrecedence = {
	not: ['|>', '(', '.'],
	'-': ['|>', '(', '.']
}

const binaryOperatorPrecedence = {
	'|>': ['=>', 'not', '('],
	'**': ['=>', 'not', '|>', '('],
	'*': ['=>', 'not', '|>', '(', '**'],
	'/': ['=>', 'not', '|>', '(', '**'],
	'%': ['=>', 'not', '|>', '(', '**'],
	'+': ['=>', 'not', '|>', '(', '**', '*', '%', '/'],
	'-': ['=>', 'not', '|>', '(', '**', '*', '%', '/'],
	'<': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'>': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'>=': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'<=': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'==': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'!=': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	and: ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	or: ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-']
}

const grammar = [
	// Terminals
	...unaryOperators.map(o => new Production([o], () => new UnaryOperator(o))),
	...binaryOperators.map(o => new Production([o], () => new BinaryOperator(o))),
	new Production(['Comment'], () => []),
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
		(peek, _, op) => !binaryOperatorPrecedence[op.operator].includes(peek)
	),
	new Production(
		['UnaryOperator', 'Expression'],
		(op, expression) => new UnaryExpression(op, expression),
		(peek, op) => !unaryOperatorPrecedence[op.operator].includes(peek)
	),
	new Production(['Expression', 'UnaryOperator'], (left, operator) => ({
		type: 'OpenUnaryExpression',
		left,
		operator: operator.operator
	})),

	new Production(
		['OpenUnaryExpression', 'Expression'],
		(openExpression, right) =>
			new BinaryExpression(
				openExpression.left,
				new BinaryOperator(openExpression.operator),
				right
			),
		peek => !binaryOperatorPrecedence['-'].includes(peek)
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
		(_, expression) =>
			new ObjectExpression([
				new ObjectProperty(expression, { computed: false })
			])
	),
	new Production(
		['{', '#', 'IdentifierExpression|NamedParameter|RestElement', '}'],
		(_1, _2, expression) =>
			new ObjectExpression([new ObjectProperty(expression, { computed: true })])
	),
	new Production(
		['{', 'IdentifierExpression|NamedParameter|RestElement', ','],
		(_, expression) =>
			arrayOf('ObjectProperty', [
				new ObjectProperty(expression, { computed: false })
			])
	),
	new Production(
		['{', '#', 'IdentifierExpression|NamedParameter|RestElement', ','],
		(_1, _2, expression) =>
			arrayOf('ObjectProperty', [
				new ObjectProperty(expression, { computed: true })
			])
	),

	new Production(
		[
			'[ObjectProperty]',
			'IdentifierExpression|NamedParameter|RestElement',
			','
		],
		(properties, expression) =>
			arrayOf('ObjectProperty', [
				...properties.values,
				new ObjectProperty(expression, { computed: false })
			])
	),
	new Production(
		[
			'[ObjectProperty]',
			'#',
			'IdentifierExpression|NamedParameter|RestElement',
			','
		],
		(properties, _, expression) =>
			arrayOf('ObjectProperty', [
				...properties.values,
				new ObjectProperty(expression, { computed: true })
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
				new ObjectProperty(expression, { computed: false })
			])
	),
	new Production(
		[
			'[ObjectProperty]',
			'#',
			'IdentifierExpression|NamedParameter|RestElement',
			'}'
		],
		(expressions, _, expression) =>
			new ObjectExpression([
				...expressions.values,
				new ObjectProperty(expression, { computed: true })
			])
	),

	new Production(
		['Expression', '.', 'IdentifierExpression'],
		(expression, _, accessor) =>
			new ObjectAccessExpression(expression, accessor, {
				safe: false,
				computed: false
			})
	),
	new Production(
		['Expression', '#', 'Expression'],
		(expression, _, accessor) =>
			new ObjectAccessExpression(expression, accessor, {
				safe: false,
				computed: true
			})
	),
	new Production(
		['Expression', '?', '.', 'IdentifierExpression'],
		(expression, _1, _2, accessor) =>
			new ObjectAccessExpression(expression, accessor, {
				safe: true,
				computed: false
			})
	),
	new Production(
		['Expression', '?', '#', 'Expression'],
		(expression, _1, _2, accessor) =>
			new ObjectAccessExpression(expression, accessor, {
				safe: true,
				computed: true
			})
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
		(a, expression) => new RestElement(expression),
		lowestPrecedence
	),

	// PatternExpressions
	new Production(
		['PatternExpression', 'PatternCase'],
		(patternExpression, patternCase) =>
			new PatternExpression(patternExpression.expression, [
				...patternExpression.patternCases,
				patternCase
			])
	),
	new Production(
		['match', 'Expression', 'PatternCase'],
		(_, expression, patternCase) =>
			new PatternExpression(expression, [patternCase])
	),

	// Begin pattern
	new Production(['_'], () => new NoPattern()),
	new Production(['|', 'NoPattern', '->'], () => ({
		type: 'UnusedPattern',
		pattern: new NoPattern()
	})),
	new Production(
		[
			'|',
			'IdentifierExpression|BooleanExpression|NumberExpression|StringExpression|ArrayExpression|ObjectExpression',
			'->'
		],
		(_, identifier) => ({ type: 'UnusedPattern', pattern: identifier })
	),
	new Production(
		['UnusedPattern', 'Expression'],
		({ pattern }, expression) => new PatternCase(pattern, expression),
		lowestPrecedence
	),

	// Functions
	new Production(['Expression', '('], expression => [
		expression,
		arrayOf('Parameter', [])
	]),
	new Production(
		['Expression', '[Parameter]', ')'],
		expression => new CallExpression(expression, [])
	),

	new Production(['(', 'Expression', ')'], (_, expression) => expression),

	new Production(
		['IdentifierExpression', '=>', 'Expression'],
		(identifier, _, body) => new FunctionExpression([identifier], body),
		functionExpressionPrecedence
	),
	new Production(['(', ')'], () => ({
		type: 'ClosedParameters',
		values: []
	})),
	new Production(
		['(', 'Expression|NamedParameter|RestElement', ','],
		(_, parameter) => arrayOf('Parameter', [parameter])
	),
	new Production(
		['(', 'Expression|NamedParameter|RestElement', ')'],
		(_, parameter) => ({
			type: 'ClosedParameters',
			values: [parameter]
		})
	),

	new Production(
		['[Parameter]', 'Expression|NamedParameter|RestElement', ','],
		(parameters, parameter) =>
			arrayOf('Parameter', [...parameters.values, parameter])
	),
	new Production(
		['[Parameter]', 'Expression|NamedParameter|RestElement', ')'],
		(parameters, parameter) => ({
			type: 'ClosedParameters',
			values: [...parameters.values, parameter]
		})
	),
	new Production(
		['ClosedParameters', '=>', 'Expression'],
		(parameters, _, body) => new FunctionExpression(parameters.values, body),
		functionExpressionPrecedence
	),

	// FunctionCalls
	new Production(
		['Expression', 'ClosedParameters'],
		(expression, parameters) =>
			new CallExpression(expression, parameters.values)
	),

	// Declarations
	new Production(
		[
			'import',
			'NoPattern|ArrayExpression|IdentifierExpression|ObjectExpression',
			'from'
		],
		(_, expression) => ({
			type: 'OpenImport',
			expression
		})
	),
	new Production(
		['OpenImport', 'StringExpression'],
		(openImport, path) => new ImportDeclaration(openImport.expression, path)
	),

	new Production(
		[
			'NoPattern|ArrayExpression|IdentifierExpression|ObjectExpression',
			'=',
			'Expression'
		],
		(array, _, expression) => new Declaration(array, expression),
		lowestPrecedence
	),

	// File
	new Production(['Node', '$'], statement => new File([statement])),
	new Production(
		['Node', 'File'],
		(statement, file) => new File([statement, ...file.nodes])
	),

	// Let
	new Production(['let', 'Declaration'], (_, declaration) => ({
		type: 'OpenLetExpression',
		declarations: [declaration]
	})),
	new Production(
		['OpenLetExpression', 'Declaration'],
		(openLet, declaration) => ({
			type: 'OpenLetExpression',
			declarations: [...openLet.declarations, declaration]
		})
	),
	new Production(
		['OpenLetExpression', 'in', 'Expression'],
		(openLet, _, expression) =>
			new LetExpression(openLet.declarations, expression),
		lowestPrecedence
	)
]

const parse = tokens => {
	tokens.push({ type: '$' })
	const stack = []

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i]
		const peek = i < tokens.length - 1 ? tokens[i + 1] : {}
		stack.push(token)

		for (let j = 1; j <= Math.min(4, stack.length); j++) {
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

	if (stack.length > 1) {
		throw new Error('Parsing error')
	}

	return stack
}

export default parse
