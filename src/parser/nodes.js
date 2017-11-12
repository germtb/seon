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

	flatMapChildren(f) {
		return new File(this.nodes.reduce((acc, node) => [...acc, ...f(node)], []))
	}
}

export class IdentifierExpression extends Node {
	constructor(name) {
		super('IdentifierExpression')
		this.name = name
	}

	flatMapChildren() {
		return new IdentifierExpression(this.name)
	}
}

export class BooleanExpression extends Expression {
	constructor(value) {
		super('BooleanExpression')
		this.value = value
	}

	flatMapChildren() {
		return new BooleanExpression(this.value)
	}
}

export class NumberExpression extends Expression {
	constructor(value) {
		super('NumberExpression')
		this.value = value
	}

	flatMapChildren() {
		return new NumberExpression(this.value)
	}
}

export class StringExpression extends Expression {
	constructor(value) {
		super('StringExpression')
		this.value = value
	}

	flatMapChildren() {
		return new StringExpression(this.value)
	}
}

export class ArrayExpression extends Expression {
	constructor(values) {
		super('ArrayExpression')
		this.values = values
	}
}

export class ObjectExpression extends Expression {
	constructor(properties) {
		super('ObjectExpression')
		this.properties = properties
	}
}

export class ObjectProperty extends Node {
	constructor(property, config) {
		super('ObjectProperty')
		this.property = property
		this.config = config
	}
}

export class ObjectAccessExpression extends Node {
	constructor(expression, accessIdentifier) {
		super('ObjectAccessExpression')
		this.expression = expression
		this.accessIdentifier = accessIdentifier
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

export class CallExpression extends Expression {
	constructor(callee, parameters) {
		super('CallExpression')
		this.callee = callee
		this.parameters = parameters
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
}

export class PatternExpression extends Node {
	constructor(expression, patternCases) {
		super('PatternExpression')
		this.expression = expression
		this.patternCases = patternCases
	}
}

export class Declaration extends Statement {
	constructor(declarator, value) {
		super('Declaration')
		this.declarator = declarator
		this.value = value
	}

	flatMapChildren(f) {
		return new Declaration(...f(this.declarator), ...f(this.value))
	}
}

export class ImportDeclaration extends Statement {
	constructor(declarator, path) {
		super('ImportDeclaration')
		this.declarator = declarator
		this.path = path
	}

	flatMapChildren(f) {
		return new ImportDeclaration(f(this.declarator), this.path)
	}
}

export class LetExpression extends Expression {
	constructor(declarations, expression) {
		super('LetExpression')
		this.declarations = declarations
		this.expression = expression
	}
}
