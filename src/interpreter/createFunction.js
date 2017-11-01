export const createFunctionFactory = ({ aval }) => {
	const createFunction = (definitions, body, scopes) => ({
		call: params => {
			let hydratedparams = {}
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

					hydratedparams[definition.name] = param.value
				} else {
					const definition = leftDefinitions.shift()
					hydratedparams[definition.name] = param
				}
			}

			if (leftDefinitions.length > 0) {
				return createFunction(leftDefinitions, body, [
					...scopes,
					hydratedparams
				])
			}

			return aval(body, [...scopes, hydratedparams])
		},
		type: 'Function'
	})

	return createFunction
}
