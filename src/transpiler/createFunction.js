export const createFunctionFactory = ({ transpile }) => {
	const createFunction = node => {
		const { body } = node
		const parameters = node.parameters.map(transpile)
		return [
			`createFunction([${parameters.map(p => `'${p}'`).join(', ')}]`,
			`, ({ ${parameters.join(', ')} }) => ${transpile(body)}`,
			')'
		].join('')
	}

	return createFunction
}
