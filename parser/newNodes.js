export class Node {
	constructor(type) {
		this.type = type
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

export class File extends Node {
	constructor(nodes) {
		super('File')
		this.nodes = nodes
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
	constructor(property) {
		super('ObjectProperty')
		this.property = property
	}
}

export class BinaryOperator extends Node {
	constructor(operator) {
		super('BinaryOperator')
		this.operator = operator
	}
}

export class BinaryExpression extends Expression {
	constructor(left, operator, right) {
		super('BinaryExpression')
		this.left = left
		this.operator = operator
		this.right = right
	}
}

export class UnaryOperator extends Node {
	constructor(operator) {
		super('UnaryOperator')
		this.operator = operator
	}
}

export class UnaryExpression extends Expression {
	constructor(operator, expression) {
		super('UnaryExpression')
		this.operator = operator
		this.expression = expression
	}
}

export class RestElement extends Node {
	constructor(value) {
		super('RestElement')
		this.value = value
	}
}

export class NamedParameter extends Node {
	constructor(name, value) {
		super('NamedParameter')
		this.name = name
		this.value = value
	}
}

export class FunctionExpression extends Expression {
	constructor(parameters, body) {
		super('FunctionExpression')
		this.parameters = parameters
		this.body = body
	}
}

export class FunctionBody extends Node {
	constructor(nodes) {
		super('FunctionBody')
		this.nodes = nodes
	}
}

export class ReturnStatement extends Node {
	constructor(value) {
		super('ReturnStatement')
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

export class ArrayPattern extends Pattern {
	constructor(value) {
		super('ArrayPattern')
		this.value = value
	}
}

export class ObjectPattern extends Pattern {
	constructor(value) {
		super('ObjectPattern')
		this.value = value
	}
}

export class NoPattern extends Pattern {
	constructor() {
		super('NoPattern')
	}
}

export class PatternCase extends Node {
	constructor(pattern, result) {
		super('PatternCase')
		this.pattern = pattern
		this.result = result
	}
}

export class PatternExpression extends Node {
	constructor(expressions, patternCases) {
		super('PatternExpression')
		this.expressions = expressions
		this.patternCases = patternCases
	}
}
