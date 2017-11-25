import { traverse } from './traverse'
import tokenizer from '../tokenizer'
import parse from '../parser'

describe('traverse', () => {
	test('enters nodes', () => {
		const tokens = tokenizer('x = 0 y = 1')
		const ast = parse(tokens)
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
		const ast = parse(tokens)
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
		const ast = parse(tokens)
		traverse(ast, {
			NumberExpression: {
				enter: node => {
					node.value = node.value * 10
				}
			}
		})

		expect(ast.nodes[0].value.value).toEqual(10)
	})

	test('maps nodes', () => {
		const tokens = tokenizer('x = 1')
		const ast = parse(tokens)
		const traversedAST = traverse(ast, {
			NumberExpression: {
				map: node => {
					return { type: 'StringExpression', value: node.value.toString() }
				}
			}
		})

		expect(traversedAST.nodes[0].value.value).toEqual('1')
	})
})
