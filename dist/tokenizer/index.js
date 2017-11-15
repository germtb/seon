'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var simpleTokens = ['**', '==', '!=', '<=', '>=', '=>', '->', '|>', '[', ']', '{', '}', ')', '(', '=', '+', '-', '_', '*', '/', '%', ',', ':', '&', '|', '.', '>', '<', '#'];

var keywords = _defineProperty({
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
	}
}, '...', {
	type: '...'
});

exports.default = function (code) {
	// State
	var column = -1;
	var line = 0;
	var currentToken = '';
	var currentTokenType = void 0;

	var tokens = [];

	var push = function push(token) {
		tokens.push(_extends({}, token, {
			loc: {
				start: { column: column + 1 - currentToken.length, line: line },
				end: { column: column + 1, line: line }
			}
		}));

		currentToken = '';
		currentTokenType = null;
	};

	for (var i = 0; i < code.length; i++) {
		var character = code[i];
		var peek = code[i + 1];
		var eof = !peek;
		currentToken += character;

		if (character === '\n') {
			column = 0;
			line += 1;
		} else {
			column += 1;
		}

		if (!currentTokenType) {
			if (/\s/.test(character)) {
				currentToken = '';
				continue;
			} else if (character === "'") {
				currentTokenType = 'String';
				continue;
			} else if (character === '/' && peek === '/') {
				currentTokenType = 'Comment';
			} else if (simpleTokens.includes(currentToken + peek)) {
				continue;
			} else if (simpleTokens.includes(currentToken)) {
				if (currentToken === '.' && peek === '.') {
					currentTokenType = 'Identifier';
					continue;
				} else {
					var type = simpleTokens.find(function (c) {
						return c === currentToken;
					});
					push({ type: type });
				}
				continue;
			} else if (/[a-zA-Z]/.test(character)) {
				currentTokenType = 'Identifier';
			} else if (/[0-9]/.test(character)) {
				currentTokenType = 'Number';
			}
		}

		if (currentTokenType === 'Identifier') {
			if (currentToken === '..') {
				continue;
			} else if (currentToken === '...') {
				push({ type: '...' });
			} else if (!/[0-9a-zA-Z]/.test(peek) || eof) {
				var token = keywords[currentToken] ? keywords[currentToken] : { type: 'Identifier', value: currentToken };
				push(token);
			}
		} else if (currentTokenType === 'Comment') {
			if (peek === '\n' || eof) {
				push({ type: 'Comment', value: currentToken });
			}
		} else if (currentTokenType === 'String') {
			if (character === "'") {
				push({
					type: 'String',
					value: currentToken.substring(1, currentToken.length - 1)
				});
			}
		} else if (currentTokenType === 'Number') {
			if (character === '.') {
				currentTokenType === 'FloatNumber';
			} else if (!/[0-9.]/.test(peek) || eof) {
				push({ type: 'Number', value: parseInt(currentToken) });
			}
		} else if (currentTokenType === 'FloatNumber') {
			if (!/[0-9]/.test(peek) || eof) {
				push({ type: 'Number', value: parseFloat(currentToken) });
			}
		}
	}

	return tokens;
};