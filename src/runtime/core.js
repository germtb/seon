export const createBundle = modules => {
	const modulesCache = {}
	const getModule = index => {
		if (modulesCache[index] === undefined) {
			modulesCache[index] = modules[index](getModule)
		}
		return modulesCache[index]
	}

	return modules[modules.length - 1](getModule)
}

const internalToJSString = (x, tabulation = '') => {
	if (x.type === 'Number') {
		return x.value
	} else if (x.type === 'Boolean') {
		return x.value ? 'true' : 'false'
	} else if (x.type === 'String') {
		return `${x.value}`
	} else if (x.type === 'Function') {
		return 'Function'
	} else if (x.type === 'Object') {
		const keys = Object.keys(x.value)
		if (keys.length === 0) {
			return '{}'
		} else if (keys.length === 1) {
			return `{ ${keys[0]}: ${internalToJSString(x.value[keys[0]])} }`
		}

		return (
			'{\n' +
			keys
				.map(key => {
					return `${tabulation + '  '}${key}: ${internalToJSString(
						x.value[key],
						tabulation + '  '
					)}`
				})
				.join(',\n') +
			'\n}'
		)
	} else if (x.type === 'Array') {
		return '[' + x.value.map(internalToJSString).join(', ') + ']'
	}

	return ''
}

export const internalStringify = {
	type: 'Function',
	call: params => ({
		type: 'String',
		value: params.map(p => internalToJSString(p)).join(' ')
	})
}

export const internalType = {
	type: 'Function',
	call: params => ({
		type: 'String',
		value: params[0].type
	})
}
