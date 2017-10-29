import tokenizer from '../tokenizer'
import parse from '../parser'
import { aval } from './index'

describe('interpreter', () => {
	let scopes
	beforeEach(() => {
		scopes = [{}]
	})

	test('map #1', () => {
		const tokens = tokenizer(`
			map = (f, list) => match list
				| [] -> []
				| [ x, ... xs ] -> [ f(x), ... map(f, xs) ]
			x = map(x => x, [])
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: [],
			type: 'Array'
		})
	})

	test('map #2', () => {
		const tokens = tokenizer(`
			map = (f, list) => match list
				| [] -> []
				| [ x, ... xs ] -> [ f(x), ... map(f, xs) ]
			x = map(x => x, [1])
		`)
		const nodes = parse(tokens)
		aval(nodes[0], scopes)
		expect(scopes[0].x).toEqual({
			value: [{ type: 'Number', value: 1 }],
			type: 'Array'
		})
	})
})
