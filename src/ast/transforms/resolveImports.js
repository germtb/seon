import { traverse } from '../traverse'
// import path from 'path'
// import fs from 'fs'

export const resolveImports = (ast, modules) => {
	traverse(ast, {
		File: {
			enter: file => {
				file.nodes = file.nodes.map(node => {
					if (node.type === 'ImportDeclaration') {
						return node
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
