export const visitorsFactory = ({ transpile }) => ({
	File: node => {
		return node.nodes.map(node => transpile(node)).join('\n')
	},
	ImportDeclaration: node => {
		return ''
	},
	IdentifierExpression: node => {
		return node.name
	},
	BooleanExpression: node => {
		return node.value ? 'true' : 'false'
	},
	NumberExpression: node => {
		return node.value
	},
	StringExpression: node => {
		return '"' + node.value + '"'
	},
	ArrayExpression: node => {
		if (node.values.length === 0) {
			return '[]'
		}
		return '[ ' + node.values.map(transpile).join(', ') + ' ]'
	},
	ObjectExpression: node => {
		if (node.properties.length === 0) {
			return '{}'
		}
		return ['{', node.properties.map(transpile).join(', '), '}'].join(' ')
	},
	NamedParameter: node => {
		return `${node.name}: ${transpile(node.value)}`
	},
	RestElement: node => {
		return `...${transpile(node.value)}`
	},
	ObjectProperty: node => {
		return transpile(node.property)
	},
	ObjectAccessExpression: node => {
		return `${transpile(node.expression)}.${transpile(node.accessIdentifier)}`
	},
	BinaryOperator: node => {
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
		return node.operator
	},
	UnaryExpression: node => {
		return transpile(node.operator) + transpile(node.expression)
	},
	FunctionExpression: node => {
		let parameters
		if (node.parameters.length === 0) {
			parameters = '[]'
		} else {
			parameters = `[${node.parameters.map(transpile).join(', ')}]`
		}

		return `${parameters} => ${transpile(node.body)}`
	},
	CallExpression: node => {
		const parameters = node.parameters.map(transpile).join(', ')
		return `${transpile(node.callee)}(${parameters})`
	},
	LetExpression: node => {
		// const letScope = [...scopes, {}]
		// node.declarations.forEach(d => {
		// 	transpile(d, letScope)
		// })
		// return transpile(node.expression, letScope)
	},
	PatternExpression: node => {
		const expression = transpile(node.expression)
		const patterns = node.patternCases.map(transpile).join(', ')
		return `match(${expression}, [ ${patterns} ])`
	},
	PatternCase: node => {
		const pattern = transpile(node.pattern)
		const result = transpile(node.result)
		return `{ pattern: ${pattern}, result: ${result} }`
	},
	NoPattern: () => {
		return '_'
	},
	Declaration: node => {
		return `const ${transpile(node.declarator)} = ${transpile(node.value)}`
	}
})
