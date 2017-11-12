const simpleTokens = [
	'**',
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
	'.',
	'>',
	'<'
]

const keywords = {
	let: {
		type: 'let'
	},
	and: {
		type: 'and'
	},
	not: {
		type: 'not'
	},
	or: {
		type: 'or'
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
	match: {
		type: 'match'
	},
	import: {
		type: 'import'
	},
	from: {
		type: 'from'
	},
	['...']: {
		type: '...'
	}
}

export default code => {
	// State
	let column = -1
	let line = 0
	let currentToken = ''
	let currentTokenType

	const tokens = []

	const push = token => {
		tokens.push({
			...token,
			loc: {
				start: { column: column + 1 - currentToken.length, line },
				end: { column: column + 1, line }
			}
		})

		currentToken = ''
		currentTokenType = null
	}

	for (let i = 0; i < code.length; i++) {
		const character = code[i]
		const peek = code[i + 1]
		const eof = !peek
		currentToken += character

		if (character === '\n') {
			column = 0
			line += 1
		} else {
			column += 1
		}

		if (!currentTokenType) {
			if (/\s/.test(character)) {
				currentToken = ''
				continue
			} else if (character === "'") {
				currentTokenType = 'String'
				continue
			} else if (character === '/' && peek === '/') {
				currentTokenType = 'Comment'
			} else if (simpleTokens.includes(currentToken + peek)) {
				continue
			} else if (simpleTokens.includes(currentToken)) {
				if (currentToken === '.' && peek === '.') {
					currentTokenType = 'Identifier'
					continue
				} else {
					const type = simpleTokens.find(c => c === currentToken)
					push({ type })
				}
				continue
			} else if (/[a-zA-Z]/.test(character)) {
				currentTokenType = 'Identifier'
			} else if (/[0-9]/.test(character)) {
				currentTokenType = 'Number'
			}
		}

		if (currentTokenType === 'Identifier') {
			if (currentToken === '..') {
				continue
			} else if (currentToken === '...') {
				push({ type: '...' })
			} else if (!/[0-9a-zA-Z]/.test(peek) || eof) {
				const token = keywords[currentToken]
					? keywords[currentToken]
					: { type: 'Identifier', value: currentToken }
				push(token)
			}
		} else if (currentTokenType === 'Comment') {
			if (peek === '\n' || eof) {
				push({ type: 'Comment', value: currentToken })
			}
		} else if (currentTokenType === 'String') {
			if (character === "'") {
				push({
					type: 'String',
					value: currentToken.substring(1, currentToken.length - 1)
				})
			}
		} else if (currentTokenType === 'Number') {
			if (character === '.') {
				currentTokenType === 'FloatNumber'
			} else if (!/[0-9.]/.test(peek) || eof) {
				push({ type: 'Number', value: parseInt(currentToken) })
			}
		} else if (currentTokenType === 'FloatNumber') {
			if (!/[0-9]/.test(peek) || eof) {
				push({ type: 'Number', value: parseFloat(currentToken) })
			}
		}
	}

	return tokens
}
