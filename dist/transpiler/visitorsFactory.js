'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.visitorsFactory = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ast = require('../ast');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var parameterBuilderVisitor = (0, _ast.visitFactory)({
	IdentifierExpression: function IdentifierExpression(node, parameters) {
		parameters.push(node.name);
	},
	ArrayExpression: function ArrayExpression(node, parameters, visit) {
		node.values.forEach(function (v) {
			return visit(v, parameters);
		});
	},
	RestElement: function RestElement(node, parameters) {
		parameters.push(node.value.name);
	},
	ObjectExpression: function ObjectExpression(node, parameters, visit) {
		node.properties.forEach(function (p) {
			return visit(p.property, parameters);
		});
	}
});

var visitorsFactory = exports.visitorsFactory = function visitorsFactory(_ref) {
	var transpile = _ref.transpile,
	    createFunction = _ref.createFunction;
	return {
		File: function File(node) {
			return node.nodes.map(function (node) {
				return transpile(node);
			}).join('\n\n');
		},
		ImportDeclaration: function ImportDeclaration() {
			return '';
		},
		IdentifierExpression: function IdentifierExpression(node, _ref2) {
			var context = _ref2.context;

			return context === 'patternMatching' ? '{ type: \'IdentifierExpression\', name: \'' + node.name + '\' }' : node.name;
		},
		BooleanExpression: function BooleanExpression(node) {
			return node.value ? 'true' : 'false';
		},
		NumberExpression: function NumberExpression(node) {
			return node.value;
		},
		StringExpression: function StringExpression(node) {
			return '"' + node.value + '"';
		},
		ArrayExpression: function ArrayExpression(node, internals) {
			var value = node.values.length === 0 ? '[]' : '[ ' + node.values.map(function (node) {
				return transpile(node, internals);
			}).join(', ') + ' ]';

			return value;
		},
		ObjectExpression: function ObjectExpression(node, internals) {
			var properties = node.properties.map(function (p) {
				var node = p.property;
				var computed = p.config.computed;

				if (node.type === 'NamedParameter') {
					if (computed) {
						return '[' + node.name + ']: ' + transpile(node.value);
					}

					return node.name + ': ' + transpile(node.value);
				} else if (node.type === 'IdentifierExpression') {
					return transpile(node, internals);
				} else if (node.type === 'RestElement') {
					return transpile(node, internals);
				}

				throw 'Unrecognised object property';
			});

			if (internals.context === 'patternMatching') {
				return 'ObjectExpression(' + (node.properties.length === 0 ? '[]' : ['[', properties.join(', '), ']'].join(' ')) + ')';
			}

			return node.properties.length === 0 ? '{}' : ['{', properties.join(', '), '}'].join(' ');
		},
		NamedParameter: function NamedParameter(node) {
			return ['{', "type: 'NamedParameter',", 'name: \'' + node.name + '\',', 'value: ' + transpile(node.value), '}'].join(' ');
		},
		RestElement: function RestElement(node, _ref3) {
			var context = _ref3.context;

			return context === 'patternMatching' ? '{ type: \'RestElement\', value: { name: \'' + node.value.name + '\' } }' : '...' + transpile(node.value);
		},
		ObjectProperty: function ObjectProperty(node) {
			return transpile(node.property);
		},
		ObjectAccessExpression: function ObjectAccessExpression(node) {
			return transpile(node.expression) + '.' + transpile(node.accessIdentifier);
		},
		BinaryOperator: function BinaryOperator(node) {
			if (node.operator === 'and') {
				return '&&';
			} else if (node.operator === 'or') {
				return '||';
			}

			return node.operator;
		},
		BinaryExpression: function BinaryExpression(node) {
			if (node.operator.operator === '|>') {
				return [transpile(node.right), '(', transpile(node.left), ')'].join('');
			}

			return [transpile(node.left), transpile(node.operator), transpile(node.right)].join(' ');
		},
		UnaryOperator: function UnaryOperator(node) {
			if (node.operator === 'not') {
				return '!';
			}

			return node.operator;
		},
		UnaryExpression: function UnaryExpression(node) {
			return transpile(node.operator) + transpile(node.expression);
		},
		FunctionExpression: function FunctionExpression(node) {
			return createFunction(node);
		},
		CallExpression: function CallExpression(node, internals) {
			var parameters = node.parameters.map(function (node) {
				return transpile(node, internals);
			}).join(', ');
			return transpile(node.callee) + '(' + parameters + ')';
		},
		LetExpression: function LetExpression(node) {
			var declarations = node.declarations.map(function (node) {
				return transpile(node);
			});
			var expression = 'return ' + transpile(node.expression);
			return ['(() => {'].concat(_toConsumableArray(declarations), [expression, '})()']).join('\n');
		},
		PatternExpression: function PatternExpression(node, internals) {
			var expression = transpile(node.expression);
			var patterns = node.patternCases.map(function (node) {
				return transpile(node, internals);
			}).join(',\n');

			return ['matchExpression(' + expression + ', [', '' + patterns, '])'].join('\n');
		},
		PatternCase: function PatternCase(node, internals) {
			var pattern = transpile(node.pattern, _extends({}, internals, {
				context: 'patternMatching'
			}));
			var result = transpile(node.result);
			var parameters = [];

			parameterBuilderVisitor(node.pattern, parameters);

			var transpiledParameters = parameters.length ? '{ ' + parameters.join(', ') + ' }' : '';

			return '{ pattern: ' + pattern + ', result: (' + transpiledParameters + ') => ' + result + ' }';
		},
		NoPattern: function NoPattern() {
			return "{ type: 'NoPattern' }";
		},
		Declaration: function Declaration(node) {
			return 'const ' + transpile(node.declarator) + ' = ' + transpile(node.value);
		}
	};
};