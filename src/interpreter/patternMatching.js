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
				scope[p.value.name] = scope[p.value.name] || {
					value: [],
					type: 'Array'
				}
				scope[p.value.name].value.push(e)
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
			expressionIndex === expression.value.length &&
			patternIndex + restElement === pattern.values.length
		)
	}

	console.error(`Pattern of type ${pattern.type} not implemented yet`)
	return false
}