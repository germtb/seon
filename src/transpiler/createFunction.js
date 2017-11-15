export const createFunctionFactory = ({ transpile }) => {
	const createFunction = node => {
		const { body } = node
		const openWrap = body.type === 'ObjectExpression' ? '(' : ''
		const closeWrap = body.type === 'ObjectExpression' ? ')' : ''
		const parameters = node.parameters.map(transpile)
		const params = parameters.length === 0 ? '' : `{ ${parameters.join(', ')} }`
		return [
			`createFunction([${parameters.map(p => `'${p}'`).join(', ')}]`,
			`, (${params}) => ${openWrap}${transpile(body)}${closeWrap}`,
			')'
		].join('')
	}

	return createFunction
}
