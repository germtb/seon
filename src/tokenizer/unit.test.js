import tokenizer from '.'

describe('tokenizer', () => {
	test('produces a number token', () => {
		expect(tokenizer('1')).toEqual([
			{
				type: 'Number',
				value: 1,
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 1 }
				}
			}
		])
	})

	test('produces a float number token', () => {
		expect(tokenizer('1.0')).toEqual([
			{
				type: 'Number',
				value: 1.0,
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 3 }
				}
			}
		])
	})

	test('produces a string token', () => {
		expect(tokenizer("'1'")).toEqual([
			{
				type: 'String',
				value: '1',
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 3 }
				}
			}
		])
	})

	test('produces a true boolean token', () => {
		expect(tokenizer('true')).toEqual([
			{
				type: 'Boolean',
				value: true,
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 4 }
				}
			}
		])
	})

	test('produces a false boolean token', () => {
		expect(tokenizer('false')).toEqual([
			{
				type: 'Boolean',
				value: false,
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 5 }
				}
			}
		])
	})

	test('produces a == token', () => {
		expect(tokenizer('==')).toEqual([
			{
				type: '==',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 2, line: 0 }
				}
			}
		])
	})

	test('produces a = token', () => {
		expect(tokenizer('=')).toEqual([
			{
				type: '=',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a + token', () => {
		expect(tokenizer('+')).toEqual([
			{
				type: '+',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a - token', () => {
		expect(tokenizer('-')).toEqual([
			{
				type: '-',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a * token', () => {
		expect(tokenizer('*')).toEqual([
			{
				type: '*',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a ** token', () => {
		expect(tokenizer('**')).toEqual([
			{
				type: '**',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 2, line: 0 }
				}
			}
		])
	})

	test('produces a / token', () => {
		expect(tokenizer('/')).toEqual([
			{
				type: '/',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a % token', () => {
		expect(tokenizer('%')).toEqual([
			{
				type: '%',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a , token', () => {
		expect(tokenizer(',')).toEqual([
			{
				type: ',',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a : token', () => {
		expect(tokenizer(':')).toEqual([
			{
				type: ':',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a && token', () => {
		expect(tokenizer('&&')).toEqual([
			{
				type: '&&',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 2, line: 0 }
				}
			}
		])
	})

	test('produces a || token', () => {
		expect(tokenizer('||')).toEqual([
			{
				type: '||',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 2, line: 0 }
				}
			}
		])
	})

	test('produces a | token', () => {
		expect(tokenizer('|')).toEqual([
			{
				type: '|',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a . token', () => {
		expect(tokenizer('.')).toEqual([
			{
				type: '.',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a ( token', () => {
		expect(tokenizer('(')).toEqual([
			{
				type: '(',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a ) token', () => {
		expect(tokenizer(')')).toEqual([
			{
				type: ')',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			}
		])
	})

	test('produces a |> token', () => {
		expect(tokenizer('|>')).toEqual([
			{
				type: '|>',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 2, line: 0 }
				}
			}
		])
	})

	test('produces an Identifier token', () => {
		expect(tokenizer('hello')).toEqual([
			{
				type: 'Identifier',
				value: 'hello',
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 5 }
				}
			}
		])
	})

	test('produces an Identifier token not at the end of a file', () => {
		expect(tokenizer('hello ')).toEqual([
			{
				type: 'Identifier',
				value: 'hello',
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 5 }
				}
			}
		])
	})

	test('produces a let token', () => {
		expect(tokenizer('let')).toEqual([
			{
				type: 'let',
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 3 }
				}
			}
		])
	})

	test('produces an in token', () => {
		expect(tokenizer('in')).toEqual([
			{
				type: 'in',
				loc: {
					start: { line: 0, column: 0 },
					end: { line: 0, column: 2 }
				}
			}
		])
	})

	test('produces open and close SquareBrackets', () => {
		expect(tokenizer('[ 1 ]')).toEqual([
			{
				type: '[',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			},
			{
				type: 'Number',
				value: 1,
				loc: {
					start: { column: 2, line: 0 },
					end: { column: 3, line: 0 }
				}
			},
			{
				type: ']',
				loc: {
					start: { column: 4, line: 0 },
					end: { column: 5, line: 0 }
				}
			}
		])
	})

	test('produces open and close CurlyBrackets', () => {
		expect(tokenizer('{ 1 }')).toEqual([
			{
				type: '{',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			},
			{
				type: 'Number',
				value: 1,
				loc: {
					start: { column: 2, line: 0 },
					end: { column: 3, line: 0 }
				}
			},
			{
				type: '}',
				loc: {
					start: { column: 4, line: 0 },
					end: { column: 5, line: 0 }
				}
			}
		])
	})

	test('produces strings that contain character that seem tokens', () => {
		expect(tokenizer("'{} this [] hello 1234'")).toEqual([
			{
				type: 'String',
				value: '{} this [] hello 1234',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 23, line: 0 }
				}
			}
		])
	})

	test('produces identifiers with letters and numbers', () => {
		expect(tokenizer('x1')).toEqual([
			{
				type: 'Identifier',
				value: 'x1',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 2, line: 0 }
				}
			}
		])
	})

	test('bug #1', () => {
		expect(tokenizer('f , { x')).toEqual([
			{
				type: 'Identifier',
				value: 'f',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			},
			{
				type: ',',
				loc: {
					start: { column: 2, line: 0 },
					end: { column: 3, line: 0 }
				}
			},
			{
				type: '{',
				loc: {
					start: { column: 4, line: 0 },
					end: { column: 5, line: 0 }
				}
			},
			{
				type: 'Identifier',
				value: 'x',
				loc: {
					start: { column: 6, line: 0 },
					end: { column: 7, line: 0 }
				}
			}
		])
	})

	test('produces a comment #1', () => {
		expect(tokenizer('// x1 1234 1234')).toEqual([
			{
				type: 'Comment',
				value: '// x1 1234 1234',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 15, line: 0 }
				}
			}
		])
	})

	test('produces a comment #2', () => {
		expect(tokenizer('x // x')).toEqual([
			{
				type: 'Identifier',
				value: 'x',
				loc: {
					start: { column: 0, line: 0 },
					end: { column: 1, line: 0 }
				}
			},
			{
				type: 'Comment',
				value: '// x',
				loc: {
					start: { column: 2, line: 0 },
					end: { column: 6, line: 0 }
				}
			}
		])
	})
})
