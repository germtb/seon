export class Node {
	constructor(type) {
		this.type = type
	}

	getChildren() {
		return []
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

	getChildren() {
		return this.nodes
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
	constructor(values) {
		super('ArrayExpression')
		this.values = values
	}

	getChildren() {
		return this.values
	}
}

export class ObjectExpression extends Expression {
	constructor(properties) {
		super('ObjectExpression')
		this.properties = properties
	}

	getChildren() {
		return this.properties
	}
}

export class ObjectProperty extends Node {
	constructor(property, config) {
		super('ObjectProperty')
		this.property = property
		this.config = config
	}

	getChildren() {
		return [this.property]
	}
}

export class ObjectAccessExpression extends Node {
	constructor(expression, accessIdentifier) {
		super('ObjectAccessExpression')
		this.expression = expression
		this.accessIdentifier = accessIdentifier
	}

	getChildren() {
		return [this.expression, this.accessIdentifier]
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

	getChildren() {
		return [this.left, this.operator, this.right]
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

	getChildren() {
		return [this.operator, this.expression]
	}
}

export class RestElement extends Node {
	constructor(value) {
		super('RestElement')
		this.value = value
	}

	getChildren() {
		return this.value
	}
}

export class NamedParameter extends Node {
	constructor(name, value) {
		super('NamedParameter')
		this.name = name
		this.value = value
	}

	getChildren() {
		return [this.value]
	}
}

export class FunctionExpression extends Expression {
	constructor(parameters, body) {
		super('FunctionExpression')
		this.parameters = parameters
		this.body = body
	}

	getChildren() {
		return [this.parameters, this.body]
	}
}

export class CallExpression extends Expression {
	constructor(callee, parameters) {
		super('CallExpression')
		this.callee = callee
		this.parameters = parameters
	}

	getChildren() {
		return [this.callee, ...this.parameters]
	}
}

export class NoPattern extends Expression {
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

	getChildren() {
		return [this.pattern, this.result]
	}
}

export class PatternExpression extends Node {
	constructor(expression, patternCases) {
		super('PatternExpression')
		this.expression = expression
		this.patternCases = patternCases
	}

	getChildren() {
		return [this.expression, ...this.patternCases]
	}
}

export class Declaration extends Statement {
	constructor(declarator, value) {
		super('Declaration')
		this.declarator = declarator
		this.value = value
	}

	getChildren() {
		return [this.declarator, this.value]
	}
}

export class ImportDeclaration extends Statement {
	constructor(declarator, path) {
		super('ImportDeclaration')
		this.declarator = declarator
		this.path = path
	}

	getChildren() {
		return [this.declarator, this.path]
	}
}

export class LetExpression extends Expression {
	constructor(declarations, expression) {
		super('LetExpression')
		this.declarations = declarations
		this.expression = expression
	}

	getChildren() {
		return [...this.declarations, this.expression]
	}
}
