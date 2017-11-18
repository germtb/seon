import { resolveImports } from './resolveImports'
import {
	File,
	NumberExpression,
	ImportDeclaration,
	IdentifierExpression
} from '../../parser/nodes'
import tokenizer from '../../tokenizer'
import parse from '../../parser'

describe('resolveImports', () => {
	test('resolves no imports', () => {
		const ast = new File([new NumberExpression(0)])
		resolveImports(ast)
		expect(ast).toEqual(new File([new NumberExpression(0)]))
	})

	test('resolves core imports', () => {
		const FooModule = parse(tokenizer('module = 0'))
		const BarModule = parse(tokenizer("import foo from 'FooModule'"))
		resolveImports(BarModule, { core: { FooModule } })
		expect(BarModule).toEqual()
	})
})
