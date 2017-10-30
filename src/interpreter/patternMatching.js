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
		if (pattern.properties.length === 0) {
			return Object.keys(expression.value).length === 0
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
				const e = expression.value[p.name]

				if (!match(p, e, scope)) {
					return false
				}
			}

			scope[restElement.property.value.name] = {
				value: Object.keys(expression.value).reduce((acc, e) => {
					if (!notRestElements.find(x => x.property.name === e)) {
						acc[e] = expression.value[e]
					}
					return acc
				}, {}),
				type: 'Object'
			}

			return true
		} else {
			for (let i = 0; i < notRestElements.length; i++) {
				const p = notRestElements[i].property
				const e = expression.value[p.name]

				if (!match(p, e, scope)) {
					return false
				}
			}

			return notRestElements.length === Object.keys(expression.value).length
		}
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
