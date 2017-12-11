import { format } from 'prettier'
import tokenizer from '../tokenizer'
import parse from '../parser'
import { resolveImports } from '../ast/transforms/resolveImports/resolveImports'
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

	const run = (code, pwd) => {
		const tokens = tokenizer(code)
		const ast = parse(tokens)
		const resolvedAST = resolveImports(ast, pwd)
		const transpiledCode = transpile(resolvedAST)
		return format(transpiledCode, {
			semi: false
		})
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
