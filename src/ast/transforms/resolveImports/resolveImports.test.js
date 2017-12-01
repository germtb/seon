import { resolveImports } from './resolveImports'
import tokenizer from '../../../tokenizer'
import parse from '../../../parser'
import { Bundle } from '../../../parser/nodes'

const bin = '.'

describe('resolveImports', () => {
	test('resolves no imports', () => {
		const ast = parse(tokenizer('0'))
		const result = resolveImports(ast, __dirname, bin)
		expect(result).toEqual(new Bundle([ast]))
	})

	test('resolves core imports #1', () => {
		const BarModule = parse(tokenizer("import foo from 'FooModule'"))
		const ResolvedModule = parse(tokenizer('foo = 0'))
		const result = resolveImports(BarModule, __dirname, bin)
		expect(result).toEqual(new Bundle([ResolvedModule]))
	})

	test('resolves core imports #2', () => {
		const BarModule = parse(tokenizer("import { x } from 'FooModule'"))
		const ResolvedModule = parse(tokenizer('{ x } = 0'))
		const result = resolveImports(BarModule, __dirname, bin)
		expect(result).toEqual(new Bundle([ResolvedModule]))
	})

	test('resolves relative imports #1', () => {
		const BarModule = parse(tokenizer("import { x } from './MockModule'"))
		const ResolvedModule = parse(tokenizer('{ x } = { x: 10 }'))
		const result = resolveImports(BarModule, __dirname, bin)
		expect(result).toEqual(new Bundle([ResolvedModule]))
	})

	test('resolves nested relative imports #1', () => {
		const BarModule = parse(tokenizer("import { x } from './MockModule2'"))
		const ResolvedModule = parse(
			tokenizer(['foo = { x: 10 }', '{ x } = { x: 10 }'].join('\n\n'))
		)
		const result = resolveImports(BarModule, __dirname, bin)
		expect(result).toEqual(new Bundle([ResolvedModule]))
	})

	test('imports are cached #1', () => {
		const BarModule = parse(
			tokenizer(
				[
					"import { x } from './MockModule2'",
					"import { x } from './MockModule2'"
				].join('\n')
			)
		)
		const ResolvedModule = parse(
			tokenizer(
				['foo = { x: 10 }', '{ x } = { x: 10 }', '{ x } = { x: 10 }'].join('\n')
			)
		)
		const result = resolveImports(BarModule, __dirname, bin)
		expect(result).toEqual(new Bundle([ResolvedModule]))
	})
})
