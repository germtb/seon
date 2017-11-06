export const createFunction = (definitions, func, curriedParams = {}) => {
	return params => {
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
