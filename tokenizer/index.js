const simpleTokens = [
	'**',
	'&&',
	'||',
	'==',
	'!=',
	'<=',
	'>=',
	'=>',
	'->',
	'|>',
	'[',
	']',
	'{',
	'}',
	')',
	'(',
	'=',
	'+',
	'-',
	'_',
	'*',
	'/',
	'%',
	',',
	':',
	'&',
	'|',
	'!',
	'.',
	'>',
	'<'
]

const keywords = {
	let: {
		type: 'let'
	},
	in: {
		type: 'in'
	},
	true: {
		type: 'Boolean',
		value: true
	},
	false: {
		type: 'Boolean',
		value: false
	},
	type: {
		type: 'TypeOperator'
	}
}

export default code => {
	let column = -1
	let line = 0
	let inString = false
	let inIdentifier = false
	let currentToken = ''
	let start = null

	const tokens = []

	for (let i = 0; i < code.length; i++) {
		const character = code[i]
		const peek = i < code.length - 1 ? code[i + 1] : null

		column = character === '\n' ? 0 : column + 1
		line = character === '\n' ? line + 1 : line

		if (inString) {
			if (character === "'") {
				tokens.push({
					type: 'String',
					value: currentToken,
					loc: {
						start,
						end: { column, line }
					}
				})
				inString = false
				currentToken = ''
			} else {
				currentToken += character
			}
		} else if (/\s/.test(character)) {
			continue
		} else if (character === '.' && peek === '.') {
			tokens.push({
				type: '...',
				loc: {
					start: { column, line },
					end: { column: column + 2, line }
				}
			})
			i += 2
		} else if (character === "'") {
			currentToken = ''
			start = { column, line }
			inString = true
		} else if (peek && simpleTokens.includes(character + peek)) {
			tokens.push({
				type: character + peek,
				loc: {
					start: { column, line },
					end: { column: column + 2, line }
				}
			})
			i += 1
		} else if (simpleTokens.includes(character)) {
			tokens.push({
				type: character,
				loc: {
					start: { column, line },
					end: { column: column + 1, line }
				}
			})
		} else if (!inIdentifier && /[0-9]/.test(character)) {
			currentToken += character
			if (peek && /[0-9]/.test(peek) && i !== code.length - 1) {
				continue
			} else {
				const token = {
					type: 'Number',
					value: parseInt(currentToken)
				}
				// const loc = {
				// 	start: { column: column - currentToken.length, line },
				// 	end: { column, line }
				// }

				tokens.push({ ...token })
				currentToken = ''
			}
		} else if (!inIdentifier && /[a-zA-Z]/.test(character)) {
			currentToken += character
			inIdentifier = true

			if (i === code.length - 1 || !/[a-zA-Z0-9]/.test(peek)) {
				const token = keywords[currentToken]
					? keywords[currentToken]
					: {
							type: 'Identifier',
							value: currentToken
						}

				// const loc = {
				// 	start: { column: column - currentToken.length, line },
				// 	end: { column: column + 1, line }
				// }

				tokens.push({ ...token })

				inIdentifier = false
				currentToken = ''
			}
		} else if (inIdentifier && /[a-zA-Z0-9]/.test(character)) {
			currentToken += character

			if (i === code.length - 1 || !/[a-zA-Z0-9]/.test(peek) || peek === '\n') {
				const token = keywords[currentToken]
					? keywords[currentToken]
					: {
							type: 'Identifier',
							value: currentToken
						}

				// const loc = {
				// 	start: { column: column - currentToken.length, line },
				// 	end: { column: column + 1, line }
				// }

				tokens.push({ ...token })

				inIdentifier = false
				currentToken = ''
			}
		}
	}

	return tokens
}
