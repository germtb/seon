export const createFunctionFactory = ({ aval }) => {
	const createFunction = (definitions, body, scopes) => ({
		call: params => {
			let hydratedParams = []
			let leftDefinitions = [...definitions]

			for (let i = 0; i < params.length; i++) {
				const param = params[i]

				if (/Expression/.test(param.type)) {
					const definition = leftDefinitions.shift()
					hydratedParams[definition.name] = aval(param, scopes)
				} else if (param.type === 'NamedParameter') {
					const definition = leftDefinitions.find(
						definition => definition.name === param.name
					)
					leftDefinitions = leftDefinitions.filter(
						definition => definition.name !== param.name
					)

					hydratedParams[definition.name] = aval(param.value, scopes)
				}
			}

			if (leftDefinitions.length > 0) {
				return createFunction(leftDefinitions, body, [
					...scopes,
					hydratedParams
				])
			}

			return aval(body, [...scopes, hydratedParams])
		},
		type: 'Function'
	})

	return createFunction
}
