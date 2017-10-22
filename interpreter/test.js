import tokenizer from '../tokenizer'
import parse from '../parser'
import { aval } from './index'

describe('interpreter', () => {
	test('converts a boolean', () => {
		const tokens = tokenizer('true')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual(true)
	})

	test('converts a number', () => {
		const tokens = tokenizer('1234')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual(1234)
	})

	test('converts a string', () => {
		const tokens = tokenizer("'1234'")
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual('1234')
	})

	test('converts a binary expression', () => {
		const tokens = tokenizer('10 + 5')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual(15)
	})

	test('converts a unary expression', () => {
		const tokens = tokenizer('!true')
		const nodes = parse(tokens)
		const result = aval(nodes[0].nodes[0])
		expect(result).toEqual(false)
	})
})
