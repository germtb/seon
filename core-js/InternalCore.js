const toJSString = (x, tabulation = '') => {
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
			return `{ ${keys[0]}: ${toJSString(x.value[keys[0]])} }`
		}

		return (
			'{\n' +
			keys
				.map(key => {
					return `${tabulation + '  '}${key}: ${toJSString(
						x.value[key],
						tabulation + '  '
					)}`
				})
				.join(',\n') +
			'\n}'
		)
	} else if (x.type === 'Array') {
		return '[' + x.value.map(toJSString).join(', ') + ']'
	}

	return ''
}

exports.toJSString = toJSString

exports.stringify = {
	type: 'Function',
	call: params => ({
		type: 'String',
		value: params.map(p => toJSString(p)).join(' ')
	})
}

exports.type = {
	type: 'Function',
	call: params => ({
		type: 'String',
		value: params[0].type
	})
}
