import { resolveImports } from './resolveImports'
import tokenizer from '../../../tokenizer'
import parse from '../../../parser'
import { Bundle } from '../../../parser/nodes'

describe('resolveImports', () => {
	test('resolves no imports', () => {
		const ast = parse(tokenizer('0'))
		const result = resolveImports(ast, __dirname, __dirname)
		expect(result).toEqual(new Bundle([ast]))
	})

	test('resolves relative imports #1', () => {
		const FooModule = parse(tokenizer('module = 0'))
		const BarModule = parse(tokenizer("import foo from './FooModule'"))
		const ResolvedModule = parse(tokenizer('foo = getModule(0)'))
		const result = resolveImports(BarModule, __dirname, __dirname)
		expect(result).toEqual(new Bundle([FooModule, ResolvedModule]))
	})

	// test('resolves core imports #2', () => {
	// const BarModule = parse(tokenizer("import { x } from 'FooModule'"))
	// const ResolvedModule = parse(tokenizer('{ x } = getModule(0)'))
	// const result = resolveImports(BarModule, __dirname, __dirname)
	// expect(result).toEqual(new Bundle([ResolvedModule]))
	// })

	test('resolves relative imports #2', () => {
		const MockModule = parse(tokenizer('module = { x: 10 }'))
		const BarModule = parse(tokenizer("import { x } from './MockModule'"))
		const ResolvedModule = parse(tokenizer('{ x } = getModule(0)'))
		const result = resolveImports(BarModule, __dirname, __dirname)
		expect(result).toEqual(new Bundle([MockModule, ResolvedModule]))
	})

	test('resolves nested relative imports #1', () => {
		const MockModule = parse(tokenizer('module = { x: 10 }'))
		const MockModule2 = parse(
			tokenizer(['foo = getModule(0)', 'module = { x: 10 }'].join('\n'))
		)

		const BarModule = parse(tokenizer("import { x } from './MockModule2'"))
		const ResolvedModule = parse(tokenizer('{ x } = getModule(1)'))
		const result = resolveImports(BarModule, __dirname, __dirname)
		expect(result).toEqual(
			new Bundle([MockModule, MockModule2, ResolvedModule])
		)
	})

	test('imports are cached #1', () => {
		const MockModule = parse(tokenizer('module = { x: 10 }'))
		const MockModule2 = parse(
			tokenizer(['foo = getModule(0)', 'module = { x: 10 }'].join('\n'))
		)

		const BarModule = parse(
			tokenizer(
				[
					"import { x } from './MockModule2'",
					"import { x } from './MockModule2'"
				].join('\n')
			)
		)
		const ResolvedModule = parse(
			tokenizer(['{ x } = getModule(1)', '{ x } = getModule(1)'].join('\n'))
		)
		const result = resolveImports(BarModule, __dirname, __dirname)
		expect(result).toEqual(
			new Bundle([MockModule, MockModule2, ResolvedModule])
		)
	})
})
