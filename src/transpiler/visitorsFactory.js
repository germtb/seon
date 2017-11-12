import { visitFactory } from '../ast'

const parameterBuilderVisitor = visitFactory({
	IdentifierExpression: (node, parameters) => {
		parameters.push(node.name)
	},
	ArrayExpression: (node, parameters, visit) => {
		node.values.forEach(v => visit(v, parameters))
	},
	RestElement: (node, parameters) => {
		parameters.push(node.value.name)
	},
	ObjectExpression: (node, parameters, visit) => {
		node.properties.forEach(p => visit(p.property, parameters))
	}
})

export const visitorsFactory = ({ transpile, createFunction }) => ({
	File: node => {
		return node.nodes.map(node => transpile(node)).join('\n\n')
	},
	ImportDeclaration: () => {
		return ''
	},
	IdentifierExpression: (node, { context }) => {
		return context === 'patternMatching'
			? `{ type: 'IdentifierExpression', name: '${node.name}' }`
			: node.name
	},
	BooleanExpression: node => {
		return node.value ? 'true' : 'false'
	},
	NumberExpression: node => {
		return node.value
	},
	StringExpression: node => {
		return `"${node.value}"`
	},
	ArrayExpression: (node, internals) => {
		const value =
			node.values.length === 0
				? '[]'
				: `[ ${node.values
						.map(node => transpile(node, internals))
						.join(', ')} ]`

		return value
	},
	ObjectExpression: (node, internals) => {
		const properties = node.properties.map(p => {
			const node = p.property
			const computed = p.config.computed

			if (node.type === 'NamedParameter') {
				if (computed) {
					return `[${node.name}]: ${transpile(node.value)}`
				}

				return `${node.name}: ${transpile(node.value)}`
			} else if (node.type === 'IdentifierExpression') {
				return transpile(node, internals)
			} else if (node.type === 'RestElement') {
				return transpile(node, internals)
			}

			throw 'Unrecognised object property'
		})

		if (internals.context === 'patternMatching') {
			return `ObjectExpression(${node.properties.length === 0
				? '[]'
				: ['[', properties.join(', '), ']'].join(' ')})`
		}

		return node.properties.length === 0
			? '{}'
			: ['{', properties.join(', '), '}'].join(' ')
	},
	NamedParameter: node => {
		return [
			'{',
			"type: 'NamedParameter',",
			`name: '${node.name}',`,
			`value: ${transpile(node.value)}`,
			'}'
		].join(' ')
	},
	RestElement: (node, { context }) => {
		return context === 'patternMatching'
			? `{ type: 'RestElement', value: { name: '${node.value.name}' } }`
			: `...${transpile(node.value)}`
	},
	ObjectProperty: node => {
		return transpile(node.property)
	},
	ObjectAccessExpression: node => {
		return `${transpile(node.expression)}.${transpile(node.accessIdentifier)}`
	},
	BinaryOperator: node => {
		if (node.operator === 'and') {
			return '&&'
		} else if (node.operator === 'or') {
			return '||'
		}

		return node.operator
	},
	BinaryExpression: node => {
		return [
			transpile(node.left),
			transpile(node.operator),
			transpile(node.right)
		].join(' ')
	},
	UnaryOperator: node => {
		if (node.operator === 'not') {
			return '!'
		}

		return node.operator
	},
	UnaryExpression: node => {
		return transpile(node.operator) + transpile(node.expression)
	},
	FunctionExpression: node => {
		return createFunction(node)
	},
	CallExpression: (node, internals) => {
		const parameters = node.parameters
			.map(node => transpile(node, internals))
			.join(', ')
		return `${transpile(node.callee)}([${parameters}])`
	},
	LetExpression: node => {
		const declarations = node.declarations.map(node => transpile(node))
		const expression = `return ${transpile(node.expression)}`
		return ['(() => {', ...declarations, expression, '})()'].join('\n')
	},
	PatternExpression: (node, internals) => {
		const expression = transpile(node.expression)
		const patterns = node.patternCases
			.map(node => transpile(node, internals))
			.join(',\n')

		return [`matchExpression(${expression}, [`, `${patterns}`, '])'].join('\n')
	},
	PatternCase: (node, internals) => {
		const pattern = transpile(node.pattern, {
			...internals,
			context: 'patternMatching'
		})
		const result = transpile(node.result)
		const parameters = []

		parameterBuilderVisitor(node.pattern, parameters)

		const transpiledParameters = parameters.length
			? `{ ${parameters.join(', ')} }`
			: ''

		return `{ pattern: ${pattern}, result: (${transpiledParameters}) => ${result} }`
	},
	NoPattern: () => {
		return "{ type: 'NoPattern' }"
	},
	Declaration: node => {
		return `const ${transpile(node.declarator)} = ${transpile(node.value)}`
	}
})
