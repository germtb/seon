export const match = (expression, pattern, matchedParams) => {
	if (pattern.type === 'NoPattern') {
		return true
	} else if (pattern.type === 'BooleanExpression') {
		return pattern.value === expression.value
	} else if (pattern.type === 'NumberExpression') {
		return pattern.value === expression.value
	} else if (pattern.type === 'IdentifierExpression') {
		matchedParams[pattern.name] = expression
		return true
	} else if (pattern.type === 'ArrayExpression') {
		if (pattern.values.length === 0) {
			return expression.value.length === 0
		}

		const lastElement = pattern.values[pattern.values.length - 1]
		const restElement = lastElement.type === 'RestElement' ? lastElement : false

		if (restElement) {
			for (let i = 0; i < pattern.values.length - 1; i++) {
				const p = pattern.values[i]
				const e = expression.value[i]

				if (!match(p, e, matchedParams)) {
					return false
				}
			}

			matchedParams[restElement.value.name] = matchedParams[
				restElement.value.name
			] || {
				value: expression.value.slice(pattern.values.length - 1),
				type: 'Array'
			}
			return true
		} else {
			for (let i = 0; i < pattern.values.length; i++) {
				const p = pattern.values[i]
				const e = expression.value[i]

				if (!match(p, e, matchedParams)) {
					return false
				}
			}

			return pattern.values.length === expression.value.length
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
