'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var visitorsFactory = exports.visitorsFactory = function visitorsFactory(_ref) {
	var aval = _ref.aval,
	    get = _ref.get,
	    match = _ref.match,
	    createFunction = _ref.createFunction,
	    operations = _ref.operations;
	return {
		File: function File(node, scopes) {
			node.nodes.forEach(function (node) {
				aval(node, scopes);
			});
		},
		IdentifierExpression: function IdentifierExpression(node, scopes) {
			return get(node.name, scopes);
		},
		BooleanExpression: function BooleanExpression(node) {
			return { value: node.value, type: 'Boolean' };
		},
		NumberExpression: function NumberExpression(node) {
			return { value: node.value, type: 'Number' };
		},
		StringExpression: function StringExpression(node) {
			return { value: node.value, type: 'String' };
		},
		ArrayExpression: function ArrayExpression(node, scopes) {
			var value = node.values.reduce(function (acc, value) {
				if (value.type === 'RestElement') {
					var restValue = aval(value.value, scopes).value;
					acc.push.apply(acc, _toConsumableArray(restValue));
				} else {
					acc.push(aval(value, scopes));
				}
				return acc;
			}, []);
			return { value: value, type: 'Array' };
		},
		ObjectExpression: function ObjectExpression(node, scopes) {
			var value = node.properties.reduce(function (acc, value) {
				var keyValues = aval(value, scopes);
				Object.keys(keyValues).forEach(function (key) {
					acc[key] = keyValues[key];
				});
				return acc;
			}, {});
			return { value: value, type: 'Object' };
		},
		ObjectProperty: function ObjectProperty(node, scopes) {
			var property = node.property;

			if (property.type === 'NamedParameter') {
				return _defineProperty({}, property.name, aval(property.value, scopes));
			} else if (property.type === 'IdentifierExpression') {
				return _defineProperty({}, property.name, get(property.name, scopes));
			} else if (property.type === 'RestElement') {
				return aval(property.value, scopes).value;
			}
		},
		BinaryExpression: function BinaryExpression(node, scopes) {
			var left = aval(node.left, scopes);
			var right = aval(node.right, scopes);
			var operator = node.operator.operator;
			var operation = operations[operator];

			return operation(left, right);
		},
		UnaryExpression: function UnaryExpression(node, scopes) {
			var expression = aval(node.expression, scopes);
			var op = node.operator.operator;

			if (op === '!') {
				return !expression;
			} else if (op === 'type') {
				return expression.type;
			}
		},
		FunctionExpression: function FunctionExpression(node, scopes) {
			return createFunction(node.parameters, node.body, scopes);
		},
		CallExpression: function CallExpression(node, scopes) {
			var callee = node.callee,
			    parameters = node.parameters;

			var func = aval(callee, scopes);
			return func.call(parameters);
		},
		LetExpression: function LetExpression(node, scopes) {
			var letScope = [].concat(_toConsumableArray(scopes), [{}]);
			node.declarations.forEach(function (d) {
				aval(d, letScope);
			});
			return aval(node.expression, letScope);
		},
		PatternExpression: function PatternExpression(node, scopes) {
			var expression = aval(node.expression, scopes);

			for (var i = 0; i < node.patternCases.length; i++) {
				var pattern = node.patternCases[i];
				var matchedScope = {};

				if (match(pattern.pattern, expression, matchedScope)) {
					return aval(pattern.result, [].concat(_toConsumableArray(scopes), [matchedScope]));
				}
			}

			console.error('PatternExpression did not match');
			throw new Error('PatternExpression did not match');
		},
		Declaration: function Declaration(node, scopes) {
			var declarator = node.declarator,
			    value = node.value;

			var expression = aval(value, scopes);
			match(declarator, expression, scopes[scopes.length - 1]);
		}
	};
};