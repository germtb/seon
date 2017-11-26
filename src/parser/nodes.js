export class Node {
	constructor(type) {
		this.type = type
	}

	mapChildren() {
		return this
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

	mapChildren(f, acc) {
		return new File(this.nodes.map(node => f(node, acc)))
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

	mapChildren(f, acc) {
		return new ArrayExpression(this.values.map(node => f(node, acc)))
	}
}

export class ObjectExpression extends Expression {
	constructor(properties) {
		super('ObjectExpression')
		this.properties = properties
	}

	mapChildren(f, acc) {
		return new ObjectExpression(this.properties.map(node => f(node, acc)))
	}
}

export class ObjectProperty extends Node {
	constructor(property, config) {
		super('ObjectProperty')
		this.property = property
		this.config = config
	}

	mapChildren(f, acc) {
		return new ObjectProperty(f(this.property, acc), this.config)
	}
}

export class ObjectAccessExpression extends Node {
	constructor(expression, accessIdentifier) {
		super('ObjectAccessExpression')
		this.expression = expression
		this.accessIdentifier = accessIdentifier
	}

	mapChildren(f, acc) {
		return new ObjectAccessExpression(
			f(this.expression, acc),
			f(this.accessIdentifier, acc)
		)
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

	mapChildren(f, acc) {
		return new BinaryExpression(
			f(this.left, acc),
			f(this.operator, acc),
			f(this.right, acc)
		)
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

	mapChildren(f, acc) {
		return new UnaryExpression(f(this.operator, acc), f(this.expression, acc))
	}
}

export class RestElement extends Node {
	constructor(value) {
		super('RestElement')
		this.value = value
	}

	mapChildren(f, acc) {
		return new RestElement(f(this.value, acc))
	}
}

export class NamedParameter extends Node {
	constructor(name, value) {
		super('NamedParameter')
		this.name = name
		this.value = value
	}

	mapChildren(f, acc) {
		return new NamedParameter(this.name, f(this.value, acc))
	}
}

export class FunctionExpression extends Expression {
	constructor(parameters, body) {
		super('FunctionExpression')
		this.parameters = parameters
		this.body = body
	}

	mapChildren(f, acc) {
		return new FunctionExpression(
			this.parameters.map(p => f(p, acc)),
			f(this.body, acc)
		)
	}
}

export class CallExpression extends Expression {
	constructor(callee, parameters) {
		super('CallExpression')
		this.callee = callee
		this.parameters = parameters
	}

	mapChildren(f, acc) {
		return new CallExpression(
			f(this.callee, acc),
			this.parameters.map(p => f(p, acc)),
			f(this.body, acc)
		)
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

	mapChildren(f, acc) {
		return new PatternCase(f(this.pattern, acc), f(this.result, acc))
	}
}

export class PatternExpression extends Node {
	constructor(expression, patternCases) {
		super('PatternExpression')
		this.expression = expression
		this.patternCases = patternCases
	}

	mapChildren(f, acc) {
		return new PatternExpression(
			f(this.expression, acc),
			this.patternCases.map(p => f(p, acc))
		)
	}
}

export class Declaration extends Statement {
	constructor(declarator, value) {
		super('Declaration')
		this.declarator = declarator
		this.value = value
	}

	mapChildren(f, acc) {
		return new Declaration(f(this.declarator, acc), f(this.value, acc))
	}
}

export class ExternalDeclaration extends Statement {
	constructor(name) {
		super('ExternalDeclaration')
		this.name = name
	}
}

export class ImportDeclaration extends Statement {
	constructor(declarator, path) {
		super('ImportDeclaration')
		this.declarator = declarator
		this.path = path
	}

	mapChildren(f, acc) {
		return new Declaration(f(this.declarator, acc), f(this.path, acc))
	}
}

export class LetExpression extends Expression {
	constructor(declarations, expression) {
		super('LetExpression')
		this.declarations = declarations
		this.expression = expression
	}

	mapChildren(f, acc) {
		return new Declaration(
			this.declarations.map(d => f(d, acc)),
			f(this.expression, acc)
		)
	}
}
