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
	type: 'Function'
})

const match = (pattern, expression, matchScope) => {
	if (pattern.type === 'NoPattern') {
		return true
	} else if (pattern.type === 'BooleanExpression') {
		return pattern.value === expression.value
	} else if (pattern.type === 'NumberExpression') {
		return pattern.value === expression.value
	} else if (pattern.type === 'IdentifierExpression') {
		matchScope[pattern.name] = expression
		return true
	} else if (pattern.type === 'ArrayExpression') {
		let patternIndex = 0
		let expressionIndex = 0
		let restElement = 0

		while (
			patternIndex < pattern.values.length &&
			expressionIndex < expression.value.length
		) {
			const p = pattern.values[patternIndex]
			const e = expression.value[expressionIndex]

			if (p.type === 'RestElement') {
				matchScope[p.value] = matchScope[p.value] || {
					value: [],
					type: 'Array'
				}
				matchScope[p.value].value.push(e)
				restElement = 1
				expressionIndex++
			} else {
				if (!match(p, e, matchScope)) {
					return false
				}

				patternIndex++
				expressionIndex++
			}
		}

		return (
			expressionIndex === expression.value.length &&
			patternIndex + restElement === pattern.values.length
		)
	}

	console.error(`Pattern of type ${pattern.type} not implemented yet`)
	return false
}

const multiMatch = (multiPattern, expressions, matchedScope) => {
	if (multiPattern.pattern.length !== expressions.length) {
		return false
	}

	return multiPattern.pattern.every((p, i) =>
		match(p, expressions[i], matchedScope)
	)
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
	if (left.type !== right.type) {
		console.error(
			`Cannot sum two nodes of types ${left.type} and ${right.type}`
		)
	}
}

const operations = {
	'+': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value + right.value, type: left.type }
	},
	'-': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value - right.value, type: left.type }
	},
	'*': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value * right.value, type: left.type }
	},
	'/': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value / right.value, type: left.type }
	},
	'%': (left, right) => {
		sameTypeCheck(left, right)
		return { value: left.value % right.value, type: left.type }
	},
	'|>': (left, right) => {
		if (left.type !== 'Function') {
			console.error(
				`Node of type ${left.type} is not a function and cannot be called`
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
				const restValue = get(value.value, scopes).value
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
			return expression.type
		} else {
			console.error(`UnaryExpression ${op} not implemented yet`)
		}
	},
	RestElement: () => {
		console.info('RestElement not implemented yet')
	},
	NamedParameter: () => {
		console.info('NamedParameter not implemented yet')
	},
	FunctionExpression: (node, scopes) => {
		return createFunction(node.parameters, node.body, scopes)
	},
	FunctionBody: () => {
		console.info('FunctionBody not implemented yet')
	},
	ReturnStatement: () => {
		console.info('ReturnStatement not implemented yet')
	},
	CallExpression: (node, scopes) => {
		const { callee, parameters } = node
		const func = aval(callee, scopes)
		return func.call(parameters)
	},
	NoPattern: () => {
		console.info('NoPattern not implemented yet')
	},
	PatternCase: () => {
		console.info('PatternCase not implemented yet')
	},
	PatternExpression: (node, scopes) => {
		const expressions = node.expressions.map(e => aval(e, scopes))

		for (let i = 0; i < node.patternCases.length; i++) {
			const pattern = node.patternCases[i]
			const matchedScope = {}

			if (multiMatch(pattern, expressions, matchedScope)) {
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
