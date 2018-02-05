const visitorsFactory = ({ traverse, growScope, add, mark }) => ({
	File: (node, scopes) => {
		node.nodes.forEach(node => {
			traverse(node, scopes)
		})
	},
	ImportDeclaration: (node, scopes) => {
		add(node.declarator, scopes)
	},
	IdentifierExpression: (node, scopes) => {
		mark(node.name, scopes)
	},
	ArrayExpression: (node, scopes) => {
		node.values.forEach(node => {
			if (node.type === 'RestElement') {
				traverse(node.value, scopes)
			} else {
				traverse(node, scopes)
			}
		})
	},
	ObjectExpression: (node, scopes) => {
		node.properties.forEach(node => {
			traverse(node, scopes)
		})
	},
	ObjectProperty: (node, scopes) => {
		const { property } = node
		if (property.type === 'NamedParameter') {
			traverse(property.value, scopes)
		} else if (property.type === 'IdentifierExpression') {
			mark(property.name, scopes)
		} else if (property.type === 'RestElement') {
			traverse(property.value, scopes)
		}
	},
	ObjectAccessExpression: (node, scopes) => {
		// TODO: if computed, traverse, otherwise do not
		traverse(node.expression, scopes)
	},
	BinaryExpression: (node, scopes) => {
		traverse(node.left, scopes)
		traverse(node.right, scopes)
	},
	UnaryExpression: (node, scopes) => {
		traverse(node.expression, scopes)
	},
	FunctionExpression: (node, scopes) => {
		const functionScope = growScope(scopes)
		traverse(node.parameters, functionScope)
		traverse(node.body, functionScope)
	},
	CallExpression: (node, scopes) => {
		traverse(node.callee, scopes)
		node.parameters.forEach(node => traverse(node, scopes))
	},
	NamedParameter: (node, scopes) => {
		traverse(node.value, scopes)
	},
	LetExpression: (node, scopes) => {
		const letScope = growScope(scopes)
		node.declarations.forEach(d => {
			traverse(d, letScope)
		})
		traverse(node.expression, letScope)
	},
	PatternExpression: (node, scopes) => {
		for (const pattern of node.patternCases.length) {
			const matchedScope = growScope(scopes)

			traverse(pattern.pattern)

			add(pattern.pattern, matchedScope)
			traverse(pattern.result, matchedScope)
		}
	},
	Declaration: (node, scopes) => {
		const { declarator, value } = node
		add(declarator, scopes)
		traverse(value, scopes)
	}
})

export default () => {
	const scopesCash = new Set()
	const initialScope = {}
	scopesCash.add(initialScope)

	const traverse = (node, scopes = [initialScope]) => {
		const type = node.type
		const visitor = visitors[type]

		if (!visitor) {
			console.log(`Not visiting ${type}`)
		}

		visitor(node, scopes)
	}

	function growScope() {
		const newScope = {}
		scopesCash.add(newScope)
		return scopesCash
		// return [...scopes, newScope]
	}

	function addName(name, scopes) {
		scopes[scopes.length - 1][name] = 'Unused'
	}

	const mark = (name, scopes) => {
		for (let i = scopes.length - 1; i >= 0; i--) {
			if (scopes[i][name]) {
				scopes[i][name] = 'Used'
			}
		}
	}

	function add(node, scopes) {
		if (node.type === 'IdentifierExpression') {
			addName(node.name, scopes)
		} else if (node.type === 'ObjectExpression') {
			node.properties.forEach(node => {
				if (node.type === 'IdentifierExpression') {
					addName(node.name, scopes)
				} else {
					console.log('TODO: ObjectExpxpression')
				}
			})
		} else if (node.type === 'ArrayExpression') {
			node.properties.forEach(node => {
				if (node.type === 'IdentifierExpression') {
					addName(node.name, scopes)
				} else {
					console.log('TODO: ArrayExpression')
				}
			})
		}
	}

	const visitors = visitorsFactory({
		traverse,
		growScope,
		add,
		mark
	})

	return scopesCash
}
