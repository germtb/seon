'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var visitorsFactory = exports.visitorsFactory = function visitorsFactory(_ref) {
	var transpile = _ref.transpile;
	return {
		File: function File(node) {
			return node.nodes.map(function (node) {
				return transpile(node);
			}).join('\n');
		},
		ImportDeclaration: function ImportDeclaration(node) {
			return '';
		},
		IdentifierExpression: function IdentifierExpression(node) {
			return node.name;
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
		ArrayExpression: function ArrayExpression(node) {
			return '[' + node.values.map(transpile).join(', ') + ']';
		},
		ObjectExpression: function ObjectExpression(node) {
			if (node.properties.length === 0) {
				return '{}';
			}
			return ['{', node.properties.map(transpile).join(', '), '}'].join(' ');
		},
		NamedParameter: function NamedParameter(node) {
			return node.name + ': ' + transpile(node.value);
		},
		RestElement: function RestElement(node) {
			return '...' + transpile(node.value);
		},
		ObjectProperty: function ObjectProperty(node) {
			return transpile(node.property);
		},
		ObjectAccessExpression: function ObjectAccessExpression(node) {
			return transpile(node.expression) + '.' + transpile(node.accessIdentifier);
		},
		BinaryOperator: function BinaryOperator(node) {
			return node.operator;
		},
		BinaryExpression: function BinaryExpression(node) {
			return [transpile(node.left), transpile(node.operator), transpile(node.right)].join(' ');
		},
		UnaryOperator: function UnaryOperator(node) {
			return node.operator;
		},
		UnaryExpression: function UnaryExpression(node) {
			return transpile(node.operator) + transpile(node.expression);
		},
		FunctionExpression: function FunctionExpression(node) {
			var parameters = void 0;
			if (node.parameters.length === 0) {
				parameters = '()';
			} else if (node.parameters.length === 1) {
				parameters = transpile(node.parameters[0]);
			} else {
				parameters = '(' + node.parameters.map(transpile).join(', ') + ')';
			}

			return parameters + ' => ' + transpile(node.body);
		},
		CallExpression: function CallExpression(node) {
			var parameters = node.parameters.map(transpile).join(', ');
			return transpile(node.callee) + '(' + parameters + ')';
		},
		LetExpression: function LetExpression(node) {
			// const letScope = [...scopes, {}]
			// node.declarations.forEach(d => {
			// 	transpile(d, letScope)
			// })
			// return transpile(node.expression, letScope)
		},
		PatternExpression: function PatternExpression(node) {
			// const expression = transpile(node.expression, scopes)
			//
			// for (let i = 0; i < node.patternCases.length; i++) {
			// 	const pattern = node.patternCases[i]
			// 	const matchedScope = {}
			//
			// 	if (match(pattern.pattern, expression, matchedScope)) {
			// 		return transpile(pattern.result, [...scopes, matchedScope])
			// 	}
			// }
			//
			// console.error('PatternExpression did not match')
			// throw new Error('PatternExpression did not match')
		},
		Declaration: function Declaration(node) {
			return 'const ' + transpile(node.declarator) + ' = ' + transpile(node.value);
		}
	};
};