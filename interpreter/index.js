import tokenizer from '../tokenizer'
import parse from '../parser'

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
		console.log('FunctionExpression not implemented yet')
	},
	FunctionBody: (node, scopes) => {
		console.log('FunctionBody not implemented yet')
	},
	ReturnStatement: (node, scopes) => {
		console.log('ReturnStatement not implemented yet')
	},
	CallExpression: (node, scopes) => {
		console.log('CallExpression not implemented yet')
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
		console.log('PatternExpression not implemented yet')
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
