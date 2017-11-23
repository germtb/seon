import { resolveImports } from './resolveImports'
import tokenizer from '../../tokenizer'
import parse from '../../parser'

describe('resolveImports', () => {
	test('resolves no imports', () => {
		const ast = parse(tokenizer('0'))
		resolveImports(ast)
		expect(ast).toEqual(parse(tokenizer('0')))
	})

	test('resolves core imports #1', () => {
		const FooModule = parse(tokenizer('module = 0'))
		const BarModule = parse(tokenizer("import foo from 'FooModule'"))
		const ResolvedModule = parse(tokenizer('foo = 0'))
		resolveImports(BarModule, { core: { FooModule } })
		expect(BarModule).toEqual(ResolvedModule)
	})

	test('resolves core imports #2', () => {
		const FooModule = parse(tokenizer('module = { x: 10 }'))
		const BarModule = parse(tokenizer("import { x } from 'FooModule'"))
		const ResolvedModule = parse(tokenizer('{ x } = { x: 10 }'))
		resolveImports(BarModule, { core: { FooModule } })
		expect(BarModule).toEqual(ResolvedModule)
	})
})
