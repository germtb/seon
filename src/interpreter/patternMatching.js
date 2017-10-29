export const match = (pattern, expression, scope) => {
	if (pattern.type === 'NoPattern') {
		return true
	} else if (pattern.type === 'BooleanExpression') {
		return pattern.value === expression.value
	} else if (pattern.type === 'NumberExpression') {
		return pattern.value === expression.value
	} else if (pattern.type === 'IdentifierExpression') {
		scope[pattern.name] = expression
		return true
	} else if (pattern.type === 'ObjectExpression') {
		let patternIndex = 0
		let expressionIndex = 0
		let restElement = 0

		while (
			patternIndex < pattern.properties.length &&
			expressionIndex < Object.keys(expression.value).length
		) {
			const p = pattern.properties[patternIndex].property
			const propName = Object.keys(expression.value)[expressionIndex]
			const e = expression.value[propName]

			if (p.type === 'RestElement') {
				scope[p.value.name] = scope[p.value.name] || {
					value: {},
					type: 'Object'
				}
				scope[p.value.name].value[propName] = e
				restElement = 1
				expressionIndex++
			} else {
				if (!match(p, e, scope)) {
					return false
				}

				patternIndex++
				expressionIndex++
			}
		}

		return (
			expressionIndex === Object.keys(expression.value).length &&
			patternIndex + restElement === pattern.properties.length
		)
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

				if (!match(p, e, scope)) {
					return false
				}
			}

			scope[restElement.value.name] = scope[restElement.value.name] || {
				value: expression.value.slice(pattern.values.length - 1),
				type: 'Array'
			}
			return true
		} else {
			for (let i = 0; i < pattern.values.length; i++) {
				const p = pattern.values[i]
				const e = expression.value[i]

				if (!match(p, e, scope)) {
					return false
				}
			}

			return pattern.values.length === expression.value.length
		}
	}

	return false
}
