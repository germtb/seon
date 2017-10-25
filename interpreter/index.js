import tokenizer from '../tokenizer'
import parse from '../parser'
import { visitorsFactory } from './visitorsFactory'
import { multiMatch } from './patternMatching'
import { get, set } from './scopes'
import { createFunctionFactory } from './createFunction'
import { operations } from './operations'

const createEval = () => {
	const aval = (node, scopes = [{}]) => {
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

	const createFunction = createFunctionFactory({ aval })

	const visitors = visitorsFactory({
		aval,
		get,
		set,
		createFunction,
		multiMatch,
		operations
	})

	return aval
}

export const aval = createEval()

export const run = code => {
	const tokens = tokenizer(code)
	const nodes = parse(tokens)
	return aval(nodes)
}
