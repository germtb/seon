import findUnused from './deadCodeElimination'
import tokenizer from '../../../tokenizer'
import parse from '../../../parser'

describe('findUnused', () => {
	test('finds unused declaration', () => {
		const ast = parse(tokenizer('x = 0'))
		const result = findUnused(ast)
		expect(result).toEqual(new Set([{}]))
	})
})
