export const internalLog = params => {
	console.log(...params.map(p => internalToJSString(p)))
	return { type: 'Object', value: { type: 'IO' } }
}

// export const internalLog = {
// 	type: 'Function',
// 	call: params => {
// 		console.log(...params.map(p => internalToJSString(p)))
// 		return { type: 'Object', value: { type: 'IO' } }
// 	}
// }
