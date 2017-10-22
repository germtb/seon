import tokenizer from '../tokenizer/tokenizer'
import parse from '../parser/parser'

export const set = (name, value, scopes) => {
	scopes[scopes.length - 1][name] = value
}

export const get = (name, scopes) => {
	for (let i = scopes.length - 1; i >= 0; i--) {
		if (name in scopes[i]) {
			return scopes[i][name]
		}
	}

	throw new Error(
		`${name} not found in scopes: ${JSON.stringify(scopes, null, 2)}`
	)
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
		return node.value
	},
	NumberExpression: node => {
		return node.value
	},
	StringExpression: node => {
		return node.value
	},
	ArrayExpression: (node, scopes) => {
		return node.values.reduce((acc, value) => {
			acc.push([].concat(aval(value, scopes)))
		}, [])
	},
	ObjectExpression: (node, scopes) => {
		console.log('ObjectExpression not implemented yet')
	},
	ObjectProperty: (node, scopes) => {
		console.log('ObjectProperty not implemented yet')
	},
	BinaryExpression: (node, scopes) => {
		const left = aval(node.left, scopes)
		const right = aval(node.right, scopes)
		const op = node.operator.operator

		if (op === '+') {
			return left + right
		} else if (op === '*') {
			return left * right
		} else if (op === '/') {
			return left / right
		} else if (op === '-') {
			return left - right
		} else if (op === '%') {
			return left % right
		} else if (op === '**') {
			return Math.pow(left, right)
		} else if (op === '<') {
			return left < right
		} else if (op === '>') {
			return left > right
		} else if (op === '>=') {
			return left >= right
		} else if (op === '<=') {
			return left <= right
		} else if (op === '==') {
			return left == right
		} else if (op === '!=') {
			return left != right
		} else if (op === '&&') {
			return left && right
		} else if (op === '||') {
			return left || right
		} else if (op === '|>') {
			return right(left)
		}

		console.log(`BinaryExpression ${op} not implemented yet`)
	},
	UnaryExpression: (node, scopes) => {
		const expression = aval(node.expression, scopes)
		const op = node.operator.operator

		if (op === '!') {
			return !expression
		}

		console.log(`UnaryExpression ${op} not implemented yet`)
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
		console.log('Declaration not implemented yet')
	}
})

const createEval = () => {
	const aval = (node, scopes = [{}]) => {
		const type = node.type
		const visitor = visitors[type]

		if (!visitor) {
			throw `${type} is not a visitor`
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
