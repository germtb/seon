export const match = (expression, pattern, matchedParams = {}) => {
	if (pattern.type === 'NoPattern') {
		return true
	} else if (pattern.type === 'BooleanExpression') {
		return pattern.value === expression
	} else if (pattern.type === 'NumberExpression') {
		return pattern.value === expression
	} else if (pattern.type === 'StringExpression') {
		return pattern.value === expression
	} else if (pattern.type === 'IdentifierExpression') {
		matchedParams[pattern.name] = expression
		return true
	} else if (pattern.type === 'ObjectExpression') {
		if (typeof expression !== 'object' || Array.isArray(expression)) {
			return false
		}

		if (pattern.properties.length === 0) {
			return Object.keys(expression).length === 0
		}

		const restElement = pattern.properties.find(
			p => p.property.type === 'RestElement'
		)
		const notRestElements = pattern.properties.filter(
			p => p.property.type !== 'RestElement'
		)

		if (restElement) {
			for (let i = 0; i < notRestElements.length; i++) {
				const p = notRestElements[i].property
				const e = expression[p.name]

				if (!match(e, p, matchedParams)) {
					return false
				}
			}

			matchedParams[restElement.property.value.name] = Object.keys(
				expression
			).reduce((acc, e) => {
				if (!notRestElements.find(x => x.property.name === e)) {
					acc[e] = expression[e]
				}
				return acc
			}, {})

			return true
		} else {
			for (let i = 0; i < notRestElements.length; i++) {
				const p = notRestElements[i].property
				const e = expression[p.name]

				if (!match(e, p, matchedParams)) {
					return false
				}
			}

			return notRestElements.length === Object.keys(expression).length
		}
	} else if (pattern.type === 'ArrayExpression') {
		if (!Array.isArray(expression)) {
			return false
		}

		if (pattern.values.length === 0) {
			return expression.length === 0
		}

		const lastElement = pattern.values[pattern.values.length - 1]
		const restElement = lastElement.type === 'RestElement' ? lastElement : false

		if (restElement) {
			for (let i = 0; i < pattern.values.length - 1; i++) {
				const p = pattern.values[i]
				const e = expression[i]

				if (!e || !match(e, p, matchedParams)) {
					return false
				}
			}

			matchedParams[restElement.value.name] =
				matchedParams[restElement.value.name] ||
				expression.slice(pattern.values.length - 1)

			return true
		} else {
			for (let i = 0; i < pattern.values.length; i++) {
				const p = pattern.values[i]
				const e = expression[i]

				if (!match(e, p, matchedParams)) {
					return false
				}
			}

			return pattern.values.length === expression.length
		}
	}

	return false
}

export const matchExpression = (expression, cases) => {
	for (let i = 0; i < cases.length; i++) {
		const pattern = cases[i].pattern
		const matchedParams = {}
		const matched = match(pattern, expression, matchedParams)

		if (matched) {
			return pattern.result(matchedParams)
		}
	}

	throw 'Match expression did not match'
}
