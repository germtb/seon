export const createFunctionFactory = ({ aval }) => {
	const createFunction = (definitions, body, scopes) => ({
		call: params => {
			let hydratedParams = {}
			let leftDefinitions = [...definitions]

			for (let i = 0; i < params.length; i++) {
				const param = params[i]

				if (param.type === 'NamedParameter') {
					const definition = leftDefinitions.find(
						definition => definition.name === param.name
					)
					leftDefinitions = leftDefinitions.filter(
						definition => definition.name !== param.name
					)

					hydratedParams[definition.name] = param.value
				} else {
					const definition = leftDefinitions.shift()
					hydratedParams[definition.name] = param
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
