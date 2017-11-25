'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.resolveImports = undefined;

var _traverse = require('../../traverse');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _tokenizer = require('../../../tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _parser = require('../../../parser');

var _parser2 = _interopRequireDefault(_parser);

var _nodes = require('../../../parser/nodes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var resolveImports = exports.resolveImports = function resolveImports(ast, pwd, bin) {
	var modules = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { local: {}, core: {} };
	return (0, _traverse.traverse)(ast, {
		File: {
			map: function map(file) {
				return new _nodes.File(file.nodes.reduce(function (acc, node) {
					if (node.type === 'ImportDeclaration') {
						var modulePath = node.path.value;
						var filename = _path2.default.resolve(pwd, modulePath) + '.sn';

						if (modules[filename]) {
							var importedModule = modules[filename];
							var module = importedModule.nodes.find(function (n) {
								return n.type === 'Declaration' && n.declarator.name === 'module';
							});
							acc.push(new _nodes.Declaration(node.declarator, module.value));
						} else {
							var dirname = _path2.default.dirname(filename);
							var _file = _fs2.default.readFileSync(filename, 'utf8');
							var fileAST = (0, _parser2.default)((0, _tokenizer2.default)(_file));
							var _importedModule = resolveImports(fileAST, dirname, modules);
							modules[filename] = _importedModule;

							acc.push.apply(acc, _toConsumableArray(_importedModule.nodes.map(function (n) {
								return n.type === 'Declaration' && n.declarator.name === 'module' ? new _nodes.Declaration(node.declarator, n.value) : n;
							})));
						}
					} else {
						acc.push(node);
					}

					return acc;
				}, []));
			}
		}
	});
};