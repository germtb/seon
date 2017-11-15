
 const createFunction = (definitions, func, curriedParams = {}) => {
	return (...params) => {
		let leftDefinitions = [...definitions]
		const hydratedParams = {}

		for (let i = 0; i < params.length; i++) {
			const param = params[i]

			if (param.type === 'NamedParameter') {
				const definition = leftDefinitions.find(
					definition => definition === param.name
				)
				leftDefinitions = leftDefinitions.filter(
					definition => definition !== param.name
				)

				hydratedParams[definition] = param.value
			} else {
				const definition = leftDefinitions.shift()
				hydratedParams[definition] = param
			}
		}

		const finalParams = { ...curriedParams, ...hydratedParams }

		if (leftDefinitions.length >= 1) {
			return createFunction(leftDefinitions, func, finalParams)
		}

		return func(finalParams)
	}
}

 const match = (expression, pattern, matchedParams = {}) => {
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

 const matchExpression = (expression, cases) => {
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

 const IdentifierExpression = name => ({
	type: 'IdentifierExpression',
	name
})
 const RestElement = name => ({
	type: 'RestElement',
	value: {
		name
	}
})
 const ObjectExpression = properties => ({
	type: 'ObjectExpression',
	properties
})

const head = createFunction(['list'], ({ list }) => (matchExpression(list, [
{ pattern: [], result: () => Nothing() },
{ pattern: [ { type: 'IdentifierExpression', name: 'x' }, { type: 'RestElement', value: { name: 'xs' } } ], result: ({ x, xs }) => Just(x) }
])))

const filter = createFunction(['selector', 'list'], ({ selector,list }) => (matchExpression(list, [
{ pattern: [], result: () => [] },
{ pattern: [ { type: 'IdentifierExpression', name: 'x' }, { type: 'RestElement', value: { name: 'xs' } } ], result: ({ x, xs }) => matchExpression(selector(x), [
{ pattern: true, result: () => [ x, ...filter(selector, xs) ] },
{ pattern: false, result: () => filter(selector, xs) }
]) }
])))

const Nothing = createFunction([], () => ({ type: "Nothing" }))

const Just = createFunction(['value'], ({ value }) => ({ type: "Just", value }))

const map = createFunction(['f', 'maybe'], ({ f,maybe }) => (matchExpression(maybe.type, [
{ pattern: "Nothing", result: () => Nothing() },
{ pattern: "Just", result: () => Just(f(maybe.value)) }
])))

const withDefault = createFunction(['value', 'maybe'], ({ value,maybe }) => (matchExpression(maybe.type, [
{ pattern: "Nothing", result: () => value },
{ pattern: "Just", result: () => maybe.value }
])))

const x = withDefault("Did not work")(map(createFunction(['x'], ({ x }) => (10 * x)))(head(filter(createFunction(['x'], ({ x }) => (x > 8)))([ 8, 10, 9 ]))))

const y = withDefault("Did not work")(map(createFunction(['x'], ({ x }) => (10 * x)))(head(filter(createFunction(['x'], ({ x }) => (x > 8)))([]))))

console.log(x)

console.log(y)