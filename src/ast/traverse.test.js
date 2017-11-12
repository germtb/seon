import { traverse } from './traverse'
import tokenizer from '../tokenizer'
import parse from '../parser'
import { File, NumberExpression } from '../parser/nodes'

describe('traverse', () => {
	test('enters nodes', () => {
		const tokens = tokenizer('x = 0 y = 1')
		const ast = parse(tokens)[0]
		const acc = []
		traverse(
			ast,
			{
				IdentifierExpression: {
					enter: (node, acc) => {
						acc.push(node.name)
					}
				}
			},
			acc
		)

		expect(acc).toEqual(['x', 'y'])
	})

	test('exits nodes', () => {
		const tokens = tokenizer('x = 0 y = 1')
		const ast = parse(tokens)[0]
		const acc = []
		traverse(
			ast,
			{
				IdentifierExpression: {
					exit: (node, acc) => {
						acc.push(node.name)
					}
				}
			},
			acc
		)

		expect(acc).toEqual(['x', 'y'])
	})

	test('modifies nodes', () => {
		const tokens = tokenizer('x = 1')
		const ast = parse(tokens)[0]
		traverse(ast, {
			NumberExpression: {
				enter: node => {
					node.value = node.value * 10
				}
			}
		})

		expect(ast.nodes[0].value.value).toEqual(10)
	})

	// test('flat maps nodes', () => {
	// 	const tokens = tokenizer("import x from './foo'")
	// 	const ast = parse(tokens)[0]
	// 	const node = traverse(ast, {
	// 		ImportDeclaration: {
	// 			flatMap: () => {
	// 				return [new NumberExpression(0), new NumberExpression(1)]
	// 			}
	// 		}
	// 	})
	//
	// 	expect(node).toEqual([
	// 		new File([new NumberExpression(0), new NumberExpression(1)])
	// 	])
	// })
})