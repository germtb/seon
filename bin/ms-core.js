const toJSString = (x, tabulation = '') => {
	if (x.type === 'NumberExpression') {
		return x.value
	} else if (x.type === 'BooleanExpression') {
		return x.value ? 'true' : 'false'
	} else if (x.type === 'StringExpression') {
		return x.value
	} else if (x.type === 'FunctionExpression') {
		return 'FunctionExpression'
	} else if (x.type === 'ObjectExpression') {
		if (x.properties.length === 0) {
			return '{}'
		} else if (x.properties.length === 1) {
			return '{ ' + toJSString(x.properties[0]) + ' }'
		}

		return (
			'{\n' +
			x.properties.map(p => toJSString(p, tabulation + '  ')).join('\n') +
			'\n}'
		)
	} else if (x.type === 'ObjectProperty') {
		return (
			tabulation +
			x.property.name +
			': ' +
			toJSString(x.property.value, tabulation)
		)
	} else if (x.type === 'ArrayExpression') {
		return '[' + x.values.map(toJSString).join(', ') + ']'
	}

	return ''
}

exports.toString = {
	type: 'Function',
	call: params => ({
		type: 'String',
		value: params.map(p => toJSString(p)).join(' ')
	})
}

exports.log = {
	type: 'Function',
	call: params => {
		const logResult = params.map(p => toJSString(p)).join(' ')
		// eslint-disable-next-line
		console.log(logResult)
	}
}

exports.type = {
	type: 'Function',
	call: params => ({
		type: 'String',
		value: params[0].type
	})
}
