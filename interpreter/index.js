import tokenizer from '../tokenizer'
import parse from '../parser'

const createFunction = (definitions, body, scopes) => ({
	call: params => {
		let hydratedParams = []
		let leftDefinitions = [...definitions]

		for (let i = 0; i < params.length; i++) {
			const param = params[i]

			if (/Expression/.test(param.type)) {
				const definition = leftDefinitions.shift()
				hydratedParams[definition.name] = aval(param, scopes)
			} else if (param.type === 'NamedParameter') {
				const definition = leftDefinitions.find(
					definition => definition.name === param.name
				)
				leftDefinitions = leftDefinitions.filter(
					definition => definition.name !== param.name
				)

				hydratedParams[definition.name] = aval(param.value, scopes)
			}
		}

		if (leftDefinitions.length > 0) {
			return createFunction(leftDefinitions, body, [...scopes, hydratedParams])
		}

		return aval(body, [...scopes, hydratedParams])
	},
	__type: 'Function'
})

const match = (pattern, expression, addToScope) => {
	if (pattern.type === 'NoPattern') {
		return true
	} else if (pattern.type === 'BooleanPattern') {
		return pattern.value === expression.value
	} else if (pattern.type === 'NumberPattern') {
		return pattern.value === expression.value
	} else if (pattern.type === 'AnyPattern') {
		addToScope(pattern.value, expression)
		return true
	}

	console.error(`Pattern of type ${pattern.type} not implemented yet`)
	return false
}

const multiMatch = (pattern, expressions, add) => {
	if (pattern.pattern.length !== expressions.length) {
		return false
	}

	for (let i = 0; i < pattern.pattern.length; i++) {
		if (!match(pattern.pattern[i], expressions[i], add)) {
			return false
		}
	}
	return true
}

export const set = (name, value, scopes) => {
	if (name in scopes[scopes.length - 1]) {
		console.error(`${name} has already been assigned.`)
	}
	scopes[scopes.length - 1][name] = value
}

export const get = (name, scopes) => {
	for (let i = scopes.length - 1; i >= 0; i--) {
		if (name in scopes[i]) {
			return scopes[i][name]
		}
	}

	console.error(
		`${name} not found in scopes: ${JSON.stringify(scopes, null, 2)}`
	)
}

const sameTypeCheck = (left, right) => {
	if (left.__type !== right.__type) {
		console.error(
			`Cannot sum two nodes of types ${left.__type} and ${right.__type}`
		)
	}
}

const operations = {
	'+': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value + right.value, __type: left.__type }
	},
	'-': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value - right.value, __type: left.__type }
	},
	'*': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value * right.value, __type: left.__type }
	},
	'/': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value / right.value, __type: left.__type }
	},
	'%': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value % right.value, __type: left.__type }
	},
	'|>': (left, right) => {
		if (left.__type !== 'Function') {
			console.error(
				`Node of type ${left.__type} is not a function and cannot be called`
			)
		}
		return left.call(right)
	}
}

const visitorsFactory = ({ aval }) => ({
	File: (node, scopes) => {
		node.nodes.forEach(node => {
			aval(node, scopes)
		})
	},
	IdentifierExpression: (node, scopes) => {
		return get(node.name, scopes)
	},
	BooleanExpression: node => {
		return { value: node.value, __type: 'Boolean' }
	},
	NumberExpression: node => {
		return { value: node.value, __type: 'Number' }
	},
	StringExpression: node => {
		return { value: node.value, __type: 'String' }
	},
	ArrayExpression: (node, scopes) => {
		const value = node.values.reduce((acc, value) => {
			if (value.type === 'RestElement') {
				const restValue = get(value.value, scopes).value
				acc.push(...restValue)
			} else {
				acc.push(aval(value, scopes))
			}
			return acc
		}, [])
		return { value, __type: 'Array' }
	},
	ObjectExpression: (node, scopes) => {
		const value = node.properties.reduce((acc, value) => {
			const keyValues = aval(value, scopes)
			Object.keys(keyValues).forEach(key => {
				acc[key] = keyValues[key]
			})
			return acc
		}, {})
		return { value, __type: 'Object' }
	},
	ObjectProperty: (node, scopes) => {
		const { property } = node
		if (property.type === 'NamedParameter') {
			return { [property.name]: aval(property.value, scopes) }
		} else if (property.type === 'IdentifierExpression') {
			return { [property.name]: get(property.name, scopes) }
		} else if (property.type === 'RestElement') {
			return get(property.value, scopes).value
		}

		console.error(`ObjectProperty type ${property.type} not implemented`)
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
			return expression.__type
		} else {
			console.error(`UnaryExpression ${op} not implemented yet`)
		}
	},
	RestElement: (node, scopes) => {
		console.log('RestElement not implemented yet')
	},
	NamedParameter: (node, scopes) => {
		console.log('NamedParameter not implemented yet')
	},
	FunctionExpression: (node, scopes) => {
		return createFunction(node.parameters, node.body, scopes)
	},
	FunctionBody: (node, scopes) => {
		console.log('FunctionBody not implemented yet')
	},
	ReturnStatement: (node, scopes) => {
		console.log('ReturnStatement not implemented yet')
	},
	CallExpression: (node, scopes) => {
		const { callee, parameters } = node
		const func = aval(callee, scopes)
		return func.call(parameters)
	},
	Pattern: (node, scopes) => {
		console.log('Pattern not implemented yet')
	},
	AnyPattern: (node, scopes) => {
		console.log('AnyPattern not implemented yet')
	},
	NumberPattern: (node, scopes) => {
		console.log('NumberPattern not implemented yet')
	},
	BooleanPattern: (node, scopes) => {
		console.log('BooleanPattern not implemented yet')
	},
	StringPattern: (node, scopes) => {
		console.log('StringPattern not implemented yet')
	},
	ArrayPattern: (node, scopes) => {
		console.log('ArrayPattern not implemented yet')
	},
	ObjectPattern: (node, scopes) => {
		console.log('ObjectPattern not implemented yet')
	},
	NoPattern: (node, scopes) => {
		console.log('NoPattern not implemented yet')
	},
	PatternCase: (node, scopes) => {
		console.log('PatternCase not implemented yet')
	},
	PatternExpression: (node, scopes) => {
		const expressions = node.expressions.map(e => aval(e, scopes))
		const addToScope = (name, value) => set(name, value, scopes)

		for (let i = 0; i < node.patternCases.length; i++) {
			const pattern = node.patternCases[i]

			if (multiMatch(pattern, expressions, addToScope)) {
				return aval(pattern.result, scopes)
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

const createEval = () => {
	const aval = (node, scopes = [{}]) => {
		const type = node.type
		const visitor = visitors[type]

		if (!visitor) {
			const error = `${type} is not a visitor`
			console.error(error)
			throw new Error(error)
		}

		try {
			return visitor(node, scopes)
		} catch (error) {
			return error
		}
	}

	const visitors = visitorsFactory({
		aval
	})

	return aval
}

export const aval = createEval()

export const run = code => {
	const tokens = tokenizer(code)
	const nodes = parse(tokens)
	return aval(nodes)
}
