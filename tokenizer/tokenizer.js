// @flow

type Token = {
	type: string,
	value?: any
}

const monoTokens = {
	'[': {
		type: '['
	},
	']': {
		type: ']'
	},
	'{': { type: '{' },
	'}': { type: '}' },
	')': { type: ')' },
	'(': { type: '(' },
	'=': { type: '=' },
	'+': { type: '+' },
	'-': { type: '-' },
	'*': { type: '*' },
	'/': { type: '/' },
	'%': { type: '%' },
	',': { type: ',' },
	':': { type: ':' },
	'&': { type: '&' },
	'|': { type: '|' },
	'!': { type: '!' },
	'.': { type: '.' },
	'>': { type: '>' },
	'<': { type: '<' }
}

const biTokens = {
	'*': {
		first: '*',
		second: '*',
		type: '**'
	},
	'&': {
		first: '&',
		second: '&',
		type: '&&'
	},
	'|': {
		first: '|',
		second: '|',
		type: '||'
	},
	'=': {
		first: '=',
		second: '=',
		type: '=='
	},
	'!': {
		first: '!',
		second: '=',
		type: '!='
	},
	'<': {
		first: '<',
		second: '=',
		type: '<='
	},
	'>': {
		first: '>',
		second: '=',
		type: '>='
	}
}

const keywords = {
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

export default (code: string): Array<Token> => {
	let inString: boolean = false
	let currentToken: string = ''
	const tokens: Array<Token> = []

	for (let i = 0; i < code.length; i++) {
		const character = code[i]
		const peek = i < code.length - 1 ? code[i + 1] : null

		if (inString) {
			if (character === "'") {
				tokens.push({ type: 'String', value: currentToken })
				inString = false
				currentToken = ''
			} else {
				currentToken += character
			}
		} else if (/\s/.test(character)) {
			continue
		} else if (character === "'") {
			currentToken = ''
			inString = true
		} else if (biTokens[character] && biTokens[character].second === peek) {
			tokens.push({ type: biTokens[character].type })
			i += 1
		} else if (monoTokens[character]) {
			tokens.push({ type: monoTokens[character].type })
		} else if (/[0-9]/.test(character)) {
			currentToken += character
			if (peek && /[0-9]/.test(peek) && i !== code.length - 1) {
				continue
			} else {
				tokens.push({ type: 'Number', value: parseInt(currentToken) })
				currentToken = ''
			}
		} else if (/[a-zA-Z]/.test(character)) {
			currentToken += character
			if (peek && /[a-zA-Z0-9]/.test(peek) && i !== code.length - 1) {
				continue
			} else {
				if (keywords[currentToken]) {
					tokens.push(keywords[currentToken])
				} else {
					tokens.push({ type: 'Identifier', value: currentToken })
				}
				currentToken = ''
			}
		}
	}

	return tokens
}
