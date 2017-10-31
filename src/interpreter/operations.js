const sameTypeCheck = (left, right) => {
	if (left.type !== right.type) {
		const error = `Cannot sum two nodes of types ${left.type} and ${right.type}`
		throw new Error(error)
	}
}

export const operations = {
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
		if (right.type !== 'Function') {
			throw new Error(
				`Node of type ${right.type} is not a function and cannot be called`
			)
		}
		return right.call([left])
	},
	'**': () => {
		throw new Error('** not implemented')
	},
	'<': (left, right) => {
		return { type: 'Boolean', value: left.value < right.value }
	},
	'>': (left, right) => {
		return { type: 'Boolean', value: left.value > right.value }
	},
	'>=': (left, right) => {
		return { type: 'Boolean', value: left.value >= right.value }
	},
	'<=': (left, right) => {
		return { type: 'Boolean', value: left.value <= right.value }
	},
	'==': (left, right) => {
		return { type: 'Boolean', value: left.value == right.value }
	},
	'!=': (left, right) => {
		return { type: 'Boolean', value: left.value != right.value }
	},
	'&&': (left, right) => {
		return { type: 'Boolean', value: left.value && right.value }
	},
	'||': (left, right) => {
		return { type: 'Boolean', value: left.value || right.value }
	}
}
