export const visitorsFactory = ({
	aval,
	get,
	set,
	match,
	createFunction,
	operations
}) => ({
	File: (node, scopes) => {
		node.nodes.forEach(node => {
			aval(node, scopes)
		})
	},
	IdentifierExpression: (node, scopes) => {
		return get(node.name, scopes)
	},
	BooleanExpression: node => {
		return { value: node.value, type: 'Boolean' }
	},
	NumberExpression: node => {
		return { value: node.value, type: 'Number' }
	},
	StringExpression: node => {
		return { value: node.value, type: 'String' }
	},
	ArrayExpression: (node, scopes) => {
		const value = node.values.reduce((acc, value) => {
			if (value.type === 'RestElement') {
				const restValue = aval(value.value, scopes).value
				acc.push(...restValue)
			} else {
				acc.push(aval(value, scopes))
			}
			return acc
		}, [])
		return { value, type: 'Array' }
	},
	ObjectExpression: (node, scopes) => {
		const value = node.properties.reduce((acc, value) => {
			const keyValues = aval(value, scopes)
			Object.keys(keyValues).forEach(key => {
				acc[key] = keyValues[key]
			})
			return acc
		}, {})
		return { value, type: 'Object' }
	},
	ObjectProperty: (node, scopes) => {
		const { property } = node
		if (property.type === 'NamedParameter') {
			return { [property.name]: aval(property.value, scopes) }
		} else if (property.type === 'IdentifierExpression') {
			return { [property.name]: get(property.name, scopes) }
		} else if (property.type === 'RestElement') {
			return aval(property.value, scopes).value
		}
	},
	BinaryExpression: (node, scopes) => {
		const left = aval(node.left, scopes)
		const right = aval(node.right, scopes)
		const operator = node.operator.operator
		const operation = operations[operator]

		if (operation) {
			return operation(left, right)
		} else {
			console.error(`BinaryExpression ${operator} not implemented yet`)
		}
	},
	UnaryExpression: (node, scopes) => {
		const expression = aval(node.expression, scopes)
		const op = node.operator.operator

		if (op === '!') {
			return !expression
		} else if (op === 'type') {
			return expression.type
		} else {
			console.error(`UnaryExpression ${op} not implemented yet`)
		}
	},
	FunctionExpression: (node, scopes) => {
		return createFunction(node.parameters, node.body, scopes)
	},
	CallExpression: (node, scopes) => {
		const { callee, parameters } = node
		const func = aval(callee, scopes)
		return func.call(parameters)
	},
	LetExpression: () => {
		console.info('LetExpression not implemented yet')
	},
	PatternExpression: (node, scopes) => {
		const expression = aval(node.expression, scopes)

		for (let i = 0; i < node.patternCases.length; i++) {
			const pattern = node.patternCases[i]
			const matchedScope = {}

			if (match(pattern.pattern, expression, matchedScope)) {
				return aval(pattern.result, [...scopes, matchedScope])
			}
		}

		console.error('PatternExpression did not match')
	},
	Declaration: (node, scopes) => {
		const { declarator, value } = node

		if (declarator.type === 'IdentifierExpression') {
			set(declarator.name, aval(value, scopes), scopes)
		} else {
			console.error(
				`Declaration of type ${declarator.type} not implemented yet`
			)
		}
	}
})
