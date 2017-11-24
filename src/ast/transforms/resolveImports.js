import { traverse } from '../traverse'
import path from 'path'
import fs from 'fs'
import tokenizer from '../../tokenizer'
import parse from '../../parser'
import { Declaration } from '../../parser/nodes'

const getModule = (modulePath, root, modules) => {
	if (modulePath[0] === '.') {
		return getRelativeModule(modulePath, root, modules)
	} else {
		return getCoreModule(modulePath, root, modules)
	}
}

const getRelativeModule = (modulePath, root, modules) => {
	if (modules.local[modulePath]) {
		return modules.local[modulePath]
	}

	const filename = path.resolve(root, modulePath) + '.sn'
	const dirname = path.dirname(filename)
	const file = fs.readFileSync(filename, 'utf8')
	const fileAST = parse(tokenizer(file))
	resolveImports(fileAST, dirname, modules)

	modules.local[modulePath] = fileAST
	return fileAST
}

const getCoreModule = (modulePath, root, modules) => {
	return modules.core[modulePath]
}

export const resolveImports = (
	ast,
	root,
	modules = { local: {}, core: {} }
) => {
	traverse(ast, {
		File: {
			enter: file => {
				file.nodes = file.nodes.map(node => {
					if (node.type === 'ImportDeclaration') {
						const importedModule = getModule(node.path.value, root, modules)
						const module = importedModule.nodes.find(x => {
							return x.type === 'Declaration' && x.declarator.name === 'module'
						})
						return new Declaration(node.declarator, module.value)
					}

					return node
				})
			}
		}
	})
}

// export const resolveImports = (dirname, modules = {}) =>
// 	visitFactory({
// 		File: (node, _, visit) => {
// 			// node.nodes.forEach(node => {
// 			// 	visit(node)
// 			// })
// 		},
// 		ImportDeclaration: node => {
// 			// const relativeModule = node.path.value[0] === '.'
// 			// const moduleName = relativeModule
// 			// 	? path.resolve(dirname, node.path.value + '.sn')
// 			// 	: node.path.value
// 			//
// 			// let module
// 			//
// 			// if (!relativeModule || moduleName in modules) {
// 			// 	module = modules[moduleName]
// 			// } else if (relativeModule) {
// 			// 	const dirname = path.dirname(moduleName)
// 			// 	const moduleScope = [{ filename: moduleName, dirname }]
// 			// 	// const file = fs.readFileSync(moduleName, 'utf8')
// 			// 	// run(file, moduleScope)
// 			// 	module = moduleScope[0].module
// 			// 	modules[moduleName] = module
// 			// }
// 		}
// 	})
