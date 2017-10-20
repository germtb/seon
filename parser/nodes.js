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

export class IdentifierExpression extends Node {
	name: string

	constructor(name: string) {
		super('IdentifierExpression')
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

export class ObjectExpression extends Expression {
	properties: Array<Expression>

	constructor(properties: Array<Expression>) {
		super('ObjectExpression')
		this.properties = properties
	}
}

export class ObjectProperty extends Node {
	key: string
	value: Expression

	constructor(key: string, value: Expression) {
		super('ObjectProperty')
		this.key = key
		this.value = value
	}
}

export class ObjectAccessExpression extends Node {
	callee: Expression
	key: string

	constructor(callee: Expression, key: string) {
		super('ObjectAccessExpression')
		this.callee = callee
		this.key = key
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
	callee: Expression
	parameters: Array<Parameter>

	constructor(callee: Expression, parameters: Array<Parameter>) {
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
