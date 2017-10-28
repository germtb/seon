'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var simpleTokens = ['**', '&&', '||', '==', '!=', '<=', '>=', '=>', '->', '|>', '[', ']', '{', '}', ')', '(', '=', '+', '-', '_', '*', '/', '%', ',', ':', '&', '|', '!', '.', '>', '<'];

var keywords = {
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
};

exports.default = function (code) {
	var column = -1;
	var line = 0;
	var inString = false;
	var inIdentifier = false;
	var inComment = false;
	var currentToken = '';
	var start = null;

	var tokens = [];

	for (var i = 0; i < code.length; i++) {
		var character = code[i];
		var peek = i < code.length - 1 ? code[i + 1] : null;

		column = character === '\n' ? 0 : column + 1;
		line = character === '\n' ? line + 1 : line;

		if (inComment) {
			if (character === '\n' || i === code.length - 1) {
				tokens.push({
					type: 'Comment',
					value: currentToken,
					loc: {
						start: start,
						end: { column: column, line: line }
					}
				});
				inComment = false;
				currentToken = '';
			}
			continue;
		}

		if (inString) {
			if (character === "'") {
				tokens.push({
					type: 'String',
					value: currentToken,
					loc: {
						start: start,
						end: { column: column, line: line }
					}
				});
				inString = false;
				currentToken = '';
			} else {
				currentToken += character;
			}
		} else if (character === '/' && peek === '/') {
			currentToken = '';
			start = { column: column, line: line };
			inComment = true;
		} else if (/\s/.test(character)) {
			continue;
		} else if (character === '.' && peek === '.') {
			tokens.push({
				type: '...',
				loc: {
					start: { column: column, line: line },
					end: { column: column + 2, line: line }
				}
			});
			column += 2;
			i += 2;
		} else if (character === "'") {
			currentToken = '';
			start = { column: column, line: line };
			inString = true;
		} else if (peek && simpleTokens.includes(character + peek)) {
			tokens.push({
				type: character + peek,
				loc: {
					start: { column: column, line: line },
					end: { column: column + 2, line: line }
				}
			});
			column += 1;
			i += 1;
		} else if (simpleTokens.includes(character)) {
			tokens.push({
				type: character,
				loc: {
					start: { column: column, line: line },
					end: { column: column + 1, line: line }
				}
			});
		} else if (!inIdentifier && /[0-9]/.test(character)) {
			currentToken += character;
			if (peek && /[0-9]/.test(peek) && i !== code.length - 1) {
				continue;
			} else {
				var token = {
					type: 'Number',
					value: parseInt(currentToken)
				};
				var loc = {
					start: { column: column - currentToken.length + 1, line: line },
					end: { column: column + 1, line: line }
				};

				tokens.push(_extends({}, token, { loc: loc }));
				currentToken = '';
			}
		} else if (!inIdentifier && /[a-zA-Z]/.test(character)) {
			currentToken += character;
			inIdentifier = true;

			if (i === code.length - 1 || !/[a-zA-Z0-9]/.test(peek)) {
				var _token = keywords[currentToken] ? keywords[currentToken] : {
					type: 'Identifier',
					value: currentToken
				};

				var _loc = {
					start: { column: column - currentToken.length + 1, line: line },
					end: { column: column + 1, line: line }
				};

				tokens.push(_extends({}, _token, { loc: _loc }));

				inIdentifier = false;
				currentToken = '';
			}
		} else if (inIdentifier && /[a-zA-Z0-9]/.test(character)) {
			currentToken += character;

			if (i === code.length - 1 || !/[a-zA-Z0-9]/.test(peek) || peek === '\n') {
				var _token2 = keywords[currentToken] ? keywords[currentToken] : {
					type: 'Identifier',
					value: currentToken
				};

				var _loc2 = {
					start: { column: column - currentToken.length + 1, line: line },
					end: { column: column + 1, line: line }
				};

				tokens.push(_extends({}, _token2, { loc: _loc2 }));

				inIdentifier = false;
				currentToken = '';
			}
		}
	}

	return tokens;
};