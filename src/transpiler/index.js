import tokenizer from '../tokenizer'
import parse from '../parser'
import { visitorsFactory } from './visitorsFactory'

const createEval = () => {
	const transpile = (node, scopes = [{}]) => {
		const type = node.type
		const visitor = visitors[type]

		if (!visitor) {
			return `${type} is not a visitor`
		}

		try {
			return visitor(node, scopes)
		} catch (error) {
			return error
		}
	}

	const run = (code, scopes = [{}]) => {
		const tokens = tokenizer(code)
		const nodes = parse(tokens)
		return transpile(nodes[0], scopes)
	}

	const visitors = visitorsFactory({
		transpile,
		run
	})

	return { transpile, run }
}

export const { transpile, run } = createEval()
