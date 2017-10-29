import tokenizer from '../tokenizer'
import parse from '../parser'
import { visitorsFactory } from './visitorsFactory'
import { match } from './patternMatching'
import { get, set } from './scopes'
import { createFunctionFactory } from './createFunction'
import { operations } from './operations'

const createAval = () => {
	const aval = (node, scopes = [{}]) => {
		const type = node.type
		const visitor = visitors[type]

		if (!visitor) {
			return `${type} is not a visitor`
		}

		return visitor(node, scopes)
	}

	const run = (code, scopes = [{}]) => {
		const tokens = tokenizer(code)
		const nodes = parse(tokens)
		return aval(nodes[0], scopes)
	}

	const createFunction = createFunctionFactory({ aval })

	const visitors = visitorsFactory({
		aval,
		run,
		get,
		set,
		createFunction,
		match,
		operations
	})

	return { aval, run }
}

export const { aval, run } = createAval()
