// @flow

export class Node {
	type: string

	constructor(type: string) {
		this.type = type
	}
}

export class File extends Node {
	nodes: Array<Node>

	constructor(nodes: Array<Node>) {
		super('File')
		this.nodes = nodes
	}
}

export class Expression extends Node {
	constructor(type: string) {
		super(type)
	}
}

export class Statement extends Node {
	constructor(type: string) {
		super(type)
	}
}

export class Identifier extends Node {
	name: string

	constructor(name: string) {
		super('Identifier')
		this.name = name
	}
}

export class BooleanExpression extends Expression {
	value: boolean

	constructor(value: boolean) {
		super('BooleanExpression')
		this.value = value
	}
}

export class NumberExpression extends Expression {
	value: number

	constructor(value: number) {
		super('NumberExpression')
		this.value = value
	}
}

export class StringExpression extends Expression {
	value: string

	constructor(value: string) {
		super('StringExpression')
		this.value = value
	}
}

export class EmptyArrayExpression extends Expression {
	constructor() {
		super('EmptyArrayExpression')
	}
}

export class ArrayExpression extends Expression {
	value: Array<Expression>

	constructor(expressions: Array<Expression>) {
		super('ArrayExpression')
		this.value = expressions
	}
}

export class FunctionExpression extends Expression {
	parameters: Array<string>
	body: BlockStatement | Expression

	constructor(parameters: Array<string>, body: BlockStatement | Expression) {
		super('FunctionExpression')
		this.parameters = parameters
		this.body = body
	}
}

export class BlockStatement extends Statement {
	statements: Array<Statement>

	constructor(statements: Array<Statement>) {
		super('BlockStatement')
		this.statements = statements
	}
}

export class Parameter extends Node {
	id: string
	value: Expression

	constructor(id: string, value: Expression) {
		super('Parameter')
		this.id = id
		this.value = value
	}
}

export class CallExpression extends Expression {
	callee: Identifier
	parameters: Array<Parameter>

	constructor(callee: Identifier, parameters: Array<Parameter>) {
		super('CallExpression')
		this.callee = callee
		this.parameters = parameters
	}
}

export class Declaration extends Statement {
	name: string
	value: Expression

	constructor(name: string, value: Expression) {
		super('Declaration')
		this.name = name
		this.value = value
	}
}

export class BinaryExpression extends Expression {
	left: Expression
	right: Expression
	operator: BinaryOperator

	constructor(left: Expression, right: Expression, operator: BinaryOperator) {
		super('BinaryExpression')
		this.left = left
		this.right = right
		this.operator = operator
	}
}

type BinaryOperatorType =
	| '+'
	| '-'
	| '*'
	| '/'
	| '**'
	| '%'
	| '&&'
	| '||'
	| 'type'
	| '=='
	| '!='
	| '<'
	| '<='
	| '>'
	| '>='

export class BinaryOperator extends Node {
	operator: BinaryOperatorType
	constructor(operator: BinaryOperatorType) {
		super('BinaryOperator')
		this.operator = operator
	}
}

export class UnaryExpression extends Expression {
	expression: Expression
	operator: UnaryOperator

	constructor(expression: Expression, operator: UnaryOperator) {
		super('UnaryExpression')
		this.expression = expression
		this.operator = operator
	}
}

type UnaryOperatorType = '-' | '!'

export class UnaryOperator extends Node {
	operator: UnaryOperatorType

	constructor(operator: UnaryOperatorType) {
		super('UnaryOperator')
		this.operator = operator
	}
}

export class PatternMatchingCase extends Node {
	pattern: Expression
	result: Expression

	constructor(pattern: Expression, result: Expression) {
		super('PatternMatchingCase')
		this.pattern = pattern
		this.result = result
	}
}

export class PatternMatchingDefault extends Node {
	result: Expression

	constructor(result: Expression) {
		super('PatternMatchingDefault')
		this.result = result
	}
}

export class PatternMatchingExpression extends Node {
	casePatterns: Array<PatternMatchingCase>
	defaultPattern: PatternMatchingDefault

	constructor(
		casePatterns: Array<PatternMatchingCase>,
		defaultPattern: PatternMatchingDefault
	) {
		super('PatternMatchingExpression')
		this.casePatterns = casePatterns
		this.defaultPattern = defaultPattern
	}
}

export class ArrayAccessExpression extends Expression {
	object: Expression
	property: number

	constructor(object: Expression, property: number) {
		super('ArrayAccessExpression')
		this.object = object
		this.property = property
	}
}

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

class Production {
	terminals: Array<string>
	generator: Function

	constructor(terminals, generator) {
		this.terminals = terminals
		this.generator = generator
	}

	matches(nodes) {
		return (
			this.terminals.length === nodes.length &&
			nodes.reduce(
				(acc, node, index) => acc && matches(node, this.terminals[index]),
				true
			)
		)
	}
}

const matchTable = {
	Node: ['Node'],
	File: ['File', 'Node'],
	Parameter: ['Parameter', 'Node'],
	BinaryOperator: ['BinaryOperator', 'Node'],
	UnaryOperator: ['UnaryOperator', 'Node'],
	PatternMatchingDefault: ['PatternMatchingDefault', 'Node'],
	PatternMatchingCase: ['PatternMatchingCase', 'Node'],
	PatternMatchingExpression: ['PatternMatchingExpression', 'Node'],

	Statement: ['Statement', 'Node'],
	BlockStatement: ['BlockStatement', 'Statement', 'Node'],
	Declaration: ['Declaration', 'Statement', 'Node'],

	Expression: ['Expression', 'Node'],
	Identifier: ['Identifier', 'Expression', 'Node'],
	BooleanExpression: ['BooleanExpression', 'Expression', 'Node'],
	NumberExpression: ['NumberExpression', 'Expression', 'Node'],
	StringExpression: ['StringExpression', 'Expression', 'Node'],
	EmptyArrayExpression: ['EmptyArrayExpression', 'Expression', 'Node'],
	ArrayExpression: ['ArrayExpression', 'Expression', 'Node'],
	FunctionExpression: ['FunctionExpression', 'Expression', 'Node'],
	CallExpression: ['CallExpression', 'Expression', 'Node'],
	BinaryExpression: ['BinaryExpression', 'Expression', 'Node'],
	UnaryExpression: ['UnaryExpression', 'Expression', 'Node'],
	ArrayAccessExpression: ['ArrayAccessExpression', 'Expression', 'Node']
}

const matches = (node: string, type: string): boolean => {
	if (matchTable[node]) {
		return matchTable[node].includes(type)
	} else {
		return node === type
	}
}

const arrayOf = <T>(
	type: string,
	values: Array<T>
): { type: string, values: Array<T> } => ({
	type: `[${type}]`,
	values
})

const grammar: Array<Production> = [
	...binaryOperators.map(o => new Production([o], () => new BinaryOperator(o))),
	new Production(['String'], s => new StringExpression(s.value)),
	new Production(['Number'], number => new NumberExpression(number.value)),
	new Production(
		['Expression', 'BinaryOperator', 'Expression'],
		(left, op, right) => new BinaryExpression(left, right, op)
	),

	// FunctionExpression
	new Production(['(', 'Identifier'], (a, identifier) => [
		{ type: '(' },
		arrayOf('Identifier', [identifier])
	]),
	new Production(
		['[Identifier]', ',', 'Identifier'],
		(identifiers, a, identifier, b) => {
			return arrayOf('Identifier', [...identifiers.values, identifier])
		}
	),
	new Production(
		['(', '[Identifier]', ')', '=>', 'Expression'],
		(a, identifiers, b, c, expression) =>
			new FunctionExpression(identifiers.values.map(x => x.value), expression)
	),
	new Production(
		['_', '=>', 'Expression'],
		(a, b, expression) => new FunctionExpression([], expression)
	),

	// Declaration
	new Production(
		['Identifier', '=', 'Expression'],
		(identifier, b, expression) => {
			return new Declaration(identifier.value, expression)
		}
	),

	// FunctionCall
	new Production(
		['[Identifier]', ':', 'Expression'],
		(identifiers, a, expression) => {
			return arrayOf('Parameter', [
				new Parameter(identifiers.values[0].value, expression)
			])
		}
	),
	new Production(
		['Identifier', ':', 'Expression'],
		(identifier, _, expression) => new Parameter(identifier.value, expression)
	),
	new Production(
		['[Parameter]', ',', 'Parameter'],
		(parameters, a, parameter) =>
			arrayOf('Parameter', [...parameters.values, parameter])
	),
	new Production(
		['Identifier', '(', '[Parameter]', ')'],
		(identifier, a, parameters) =>
			new CallExpression(identifier.value, parameters.values)
	),

	// PatternMatchingExpression
	new Production(
		['|', '_', '->', 'Expression'],
		(a, b, c, result) => new PatternMatchingDefault(result)
	),
	new Production(
		['|', 'Expression', '->', 'Expression'],
		(a, pattern, b, result) => new PatternMatchingCase(pattern, result)
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
		stack.push(token)

		for (let j = 1; j <= Math.min(5, stack.length); j++) {
			const nodes = stack.slice(stack.length - j).map(r => r.type)

			const production = grammar.find(r => {
				return r.matches(nodes)
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
