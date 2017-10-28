export const set = (name, value, scopes) => {
	if (name in scopes[scopes.length - 1]) {
		console.error(`${name} has already been assigned.`)
	}
	scopes[scopes.length - 1][name] = value
}

export const get = (name, scopes) => {
	for (let i = scopes.length - 1; i >= 0; i--) {
		if (name in scopes[i]) {
			return scopes[i][name]
		}
	}

	console.error(
		`${name} not found in scopes: ${JSON.stringify(scopes, null, 2)}`
	)
}
