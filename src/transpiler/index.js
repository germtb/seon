import tokenizer from '../tokenizer'
import parse from '../parser'
import { visitorsFactory } from './visitorsFactory'
import { createFunctionFactory } from './createFunction'

const createTranspile = () => {
	const transpile = (node, internals = {}) => {
		const type = node.type
		const visitor = visitors[type]

		if (!visitor) {
			return `${type} is not a visitor`
		}

		return visitor(node, internals)
	}

	const run = code => {
		const tokens = tokenizer(code)
		const nodes = parse(tokens)
		return transpile(nodes[0])
	}

	const createFunction = createFunctionFactory({ transpile })

	const visitors = visitorsFactory({
		transpile,
		run,
		createFunction
	})

	return { transpile, run }
}

export const { transpile, run } = createTranspile()
