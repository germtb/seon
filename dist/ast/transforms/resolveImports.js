'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.resolveImports = undefined;

var _resolveImports = require('./resolveImports');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import fs from 'fs'

var resolveImports = exports.resolveImports = function resolveImports(dirname) {
	var modules = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	return (0, _resolveImports.visitFactory)({
		File: function File(node, _, visit) {
			node.nodes.forEach(function (node) {
				visit(node);
			});
		},
		ImportDeclaration: function ImportDeclaration(node) {
			var relativeModule = node.path.value[0] === '.';
			var moduleName = relativeModule ? _path2.default.resolve(dirname, node.path.value + '.sn') : node.path.value;

			var module = void 0;

			if (!relativeModule || moduleName in modules) {
				module = modules[moduleName];
			} else if (relativeModule) {
				var _dirname = _path2.default.dirname(moduleName);
				var moduleScope = [{ filename: moduleName, dirname: _dirname }];
				// const file = fs.readFileSync(moduleName, 'utf8')
				// run(file, moduleScope)
				module = moduleScope[0].module;
				modules[moduleName] = module;
			}
		}
	});
};