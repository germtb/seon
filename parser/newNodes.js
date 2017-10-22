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
	constructor(key, value) {
		super('ObjectProperty')
		this.key = key
		this.value = value
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
