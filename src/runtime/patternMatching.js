export const match = (expression, pattern, matchedParams = {}) => {
	if (pattern.type === 'NoPattern') {
		return true
	} else if (typeof pattern === 'boolean') {
		return pattern === expression
	} else if (typeof pattern === 'number') {
		return pattern === expression
	} else if (typeof pattern === 'string') {
		return pattern === expression
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
	} else if (Array.isArray(pattern)) {
		if (!Array.isArray(expression)) {
			return false
		}

		if (pattern.length === 0) {
			return expression.length === 0
		}

		const lastElement = pattern[pattern.length - 1]
		const restElement = lastElement.type === 'RestElement' ? lastElement : false

		if (restElement) {
			for (let i = 0; i < pattern.length - 1; i++) {
				const p = pattern[i]
				const e = expression[i]

				if (e === null || e === undefined || !match(e, p, matchedParams)) {
					return false
				}
			}

			matchedParams[restElement.value.name] =
				matchedParams[restElement.value.name] ||
				expression.slice(pattern.length - 1)

			return true
		} else {
			for (let i = 0; i < pattern.length; i++) {
				const p = pattern[i]
				const e = expression[i]

				if (!match(e, p, matchedParams)) {
					return false
				}
			}

			return pattern.length === expression.length
		}
	}

	return false
}

export const matchExpression = (expression, cases) => {
	for (let i = 0; i < cases.length; i++) {
		const pattern = cases[i].pattern
		const matchedParams = {}
		const matched = match(expression, pattern, matchedParams)

		if (matched) {
			return cases[i].result(matchedParams)
		}
	}

	throw 'Match expression did not match'
}
