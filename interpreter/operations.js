const sameTypeCheck = (left, right) => {
	if (left.type !== right.type) {
		console.error(
			`Cannot sum two nodes of types ${left.type} and ${right.type}`
		)
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
		if (left.type !== 'Function') {
			console.error(
				`Node of type ${left.type} is not a function and cannot be called`
			)
		}
		return left.call(right)
	}
}
