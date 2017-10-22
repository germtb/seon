export class Node {
	constructor(type) {
		this.type = type
	}
}

export class File extends Node {
	constructor(nodes) {
		super('File')
		this.nodes = nodes
	}
}

export class Expression extends Node {
	constructor(type) {
		super(type)
	}
}

export class Statement extends Node {
	constructor(type) {
		super(type)
	}
}

export class IdentifierExpression extends Node {
	constructor(name) {
		super('IdentifierExpression')
		this.name = name
	}
}

export class BooleanExpression extends Expression {
	constructor(value) {
		super('BooleanExpression')
		this.value = value
	}
}

export class NumberExpression extends Expression {
	constructor(value) {
		super('NumberExpression')
		this.value = value
	}
}

export class StringExpression extends Expression {
	constructor(value) {
		super('StringExpression')
		this.value = value
	}
}

export class ArrayExpression extends Expression {
	constructor(expressions) {
		super('ArrayExpression')
		this.value = expressions
	}
}

export class ObjectExpression extends Expression {
	constructor(properties) {
		super('ObjectExpression')
		this.properties = properties
	}
}

export class ObjectProperty extends Node {
	constructor(key, value) {
		super('ObjectProperty')
		this.key = key
		this.value = value
	}
}

export class ObjectAccessExpression extends Node {
	constructor(callee, key) {
		super('ObjectAccessExpression')
		this.callee = callee
		this.key = key
	}
}

export class FunctionExpression extends Expression {
	constructor(parameters, body) {
		super('FunctionExpression')
		this.parameters = parameters
		this.body = body
	}
}

export class BlockStatement extends Statement {
	constructor(statements) {
		super('BlockStatement')
		this.statements = statements
	}
}

export class Parameter extends Node {
	constructor(id, value) {
		super('Parameter')
		this.id = id
		this.value = value
	}
}

export class CallExpression extends Expression {
	constructor(callee, parameters) {
		super('CallExpression')
		this.callee = callee
		this.parameters = parameters
	}
}

export class Declaration extends Statement {
	constructor(pattern, value) {
		super('Declaration')
		this.pattern = pattern
		this.value = value
	}
}

export class BinaryExpression extends Expression {
	constructor(left, right, operator) {
		super('BinaryExpression')
		this.left = left
		this.right = right
		this.operator = operator
	}
}

export class BinaryOperator extends Node {
	constructor(operator) {
		super('BinaryOperator')
		this.operator = operator
	}
}

export class UnaryExpression extends Expression {
	constructor(expression, operator) {
		super('UnaryExpression')
		this.expression = expression
		this.operator = operator
	}
}

export class UnaryOperator extends Node {
	constructor(operator) {
		super('UnaryOperator')
		this.operator = operator
	}
}

export class PatternMatchingCase extends Node {
	constructor(pattern, result) {
		super('PatternMatchingCase')
		this.pattern = pattern
		this.result = result
	}
}

export class PatternMatchingExpression extends Node {
	constructor(parameters, cases) {
		super('PatternMatchingExpression')
		this.parameters = parameters
		this.cases = cases
	}
}

export class Pattern extends Node {
	constructor(type) {
		super(type)
	}
}

export class AnyPattern extends Pattern {
	constructor(value) {
		super('AnyPattern')
		this.value = value
	}
}

export class NumberPattern extends Pattern {
	constructor(value) {
		super('NumberPattern')
		this.value = value
	}
}

export class BooleanPattern extends Pattern {
	constructor(value) {
		super('BooleanPattern')
		this.value = value
	}
}

export class StringPattern extends Pattern {
	constructor(value) {
		super('StringPattern')
		this.value = value
	}
}

export class RestElement extends Node {
	constructor(value) {
		super('RestElement')
		this.value = value
	}
}

/**
* @param: {Array<Identifier | RestElement>} values
*/
export class ArrayPattern extends Pattern {
	constructor(values) {
		super('ArrayPattern')
		this.values = values
	}
}

/**
* @param: {Array<Identifier | RestElement>} values
*/
export class ObjectPattern extends Pattern {
	constructor(values) {
		super('ObjectPattern')
		this.values = values
	}
}

export class NoPattern extends Pattern {
	constructor() {
		super('NoPattern')
	}
}

export class MultiPattern extends Pattern {
	consctructor(patterns) {
		this.patterns = patterns
	}
}
