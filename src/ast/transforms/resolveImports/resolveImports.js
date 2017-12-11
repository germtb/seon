import { traverse } from '../../traverse'
import path from 'path'
import fs from 'fs'
import tokenizer from '../../../tokenizer'
import parse from '../../../parser'
import {
	Bundle,
	File,
	Declaration,
	CallExpression,
	IdentifierExpression,
	NumberExpression
} from '../../../parser/nodes'

export const resolveImports = (ast, pwd, modules = [], moduleIds = {}) => {
	traverse(ast, {
		File: {
			enter: file => {
				const resolvedFile = new File(
					file.nodes.map(node => {
						if (node.type === 'ImportDeclaration') {
							const modulePath = node.path.value
							const filename = path.resolve(pwd, modulePath) + '.sn'
							let moduleId

							if (moduleIds[filename]) {
								moduleId = moduleIds[filename]
							} else {
								const dirname = path.dirname(filename)
								const file = fs.readFileSync(filename, 'utf8')
								const fileAST = parse(tokenizer(file))
								resolveImports(fileAST, dirname, modules, moduleIds)
								moduleId = Object.keys(moduleIds).length
								moduleIds[filename] = moduleId
							}

							return new Declaration(
								node.declarator,
								new CallExpression(new IdentifierExpression('getModule'), [
									new NumberExpression(moduleId)
								])
							)
						} else {
							return node
						}
					})
				)

				modules.push(resolvedFile)
			}
		}
	})

	return new Bundle(modules)
}
