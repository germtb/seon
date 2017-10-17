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

	supertype(): string {
		return 'BinaryOperator'
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

export class PatternMatchingDefault extends Node {
	result: Expression

	constructor(result: Expression) {
		super('PatternMatchingDefault')
		this.result = result
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
	nonterminal: string
	terminals: Array<string>
	generator: Function

	constructor(nonterminal, terminals, generator) {
		this.nonterminal = nonterminal
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

const matches = (node: string, type: string) => {
	if (matchTable[node]) {
		return matchTable[node].includes(type)
	} else {
		return node === type
	}
}

const arrayOf = (type, values) => ({
	type: `[${type}]`,
	values
})

const grammar = [
	...binaryOperators.map(
		o => new Production('BinaryOperator', [o], () => new BinaryOperator(o))
	),
	new Production(
		'NumberExpression',
		['Number'],
		number => new NumberExpression(number.value)
	),
	new Production(
		'Expression',
		['Expression', 'BinaryOperator', 'Expression'],
		(left, op, right) => new BinaryExpression(left, right, op)
	),
	new Production(
		'[Identifier]',
		['Identifier', '[Identifier]', '=>'],
		(identifiers, identifier, b) => [
			arrayOf('Identifier', [...identifiers, identifier]),
			b
		]
	),
	new Production(
		'[Identifier]',
		['Identifier', 'Identifier', '=>'],
		(identifier1, identifier2, b) => [
			arrayOf('Identifier', [identifier1, identifier2]),
			b
		]
	),
	new Production(
		'FunctionExpression',
		['_', '=>', 'Expression'],
		(a, b, expression) => new FunctionExpression([], expression)
	),
	new Production(
		'FunctionExpression',
		['Identifier', '=>', 'Expression'],
		(identifier, b, expression) =>
			new FunctionExpression([identifier.value], expression)
	),
	new Production(
		'FunctionExpression',
		['[Identifier]', '=>', 'Expression'],
		(identifiers, b, expression) =>
			new FunctionExpression(identifiers.values.map(x => x.value), expression)
	)
]

const parse = (tokens: Array<any>): any => {
	const stack = []

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i]
		stack.push(token)

		for (let j = 0; j <= 3; j++) {
			const rule = stack.slice(i - j, i + 1).map(r => r.type)
			const production = grammar.find(r => {
				return r.matches(rule)
			})

			if (production) {
				const tokens = stack.splice(i - j, i + 1)
				const node = production.generator(...tokens)
				stack.push(...[].concat(node))
				j = 0
			}
		}
	}

	return stack
}

export default parse
