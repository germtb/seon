const toJSString = require('./Core').toJSString

exports.log = {
	type: 'Function',
	call: params => {
		// eslint-disable-next-line
		console.log(...params.map(p => toJSString(p)))
	}
}
