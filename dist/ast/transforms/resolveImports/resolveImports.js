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

var resolveImports = exports.resolveImports = function resolveImports(ast, pwd) {
	var modules = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
	var moduleIds = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

	(0, _traverse.traverse)(ast, {
		File: {
			enter: function enter(file) {
				var resolvedFile = new _nodes.File(file.nodes.map(function (node) {
					if (node.type === 'ImportDeclaration') {
						var modulePath = node.path.value;
						var filename = _path2.default.resolve(pwd, modulePath) + '.sn';
						var moduleId = void 0;

						if (moduleIds[filename]) {
							moduleId = moduleIds[filename];
						} else {
							var dirname = _path2.default.dirname(filename);
							var _file = _fs2.default.readFileSync(filename, 'utf8');
							var fileAST = (0, _parser2.default)((0, _tokenizer2.default)(_file));
							resolveImports(fileAST, dirname, modules, moduleIds);
							moduleId = Object.keys(moduleIds).length;
							moduleIds[filename] = moduleId;
						}

						return new _nodes.Declaration(node.declarator, new _nodes.CallExpression(new _nodes.IdentifierExpression('getModule'), [new _nodes.NumberExpression(moduleId)]));
					} else {
						return node;
					}
				}));

				modules.push(resolvedFile);
			}
		}
	});

	return new _nodes.Bundle(modules);
};