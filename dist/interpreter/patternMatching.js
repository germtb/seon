'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var match = exports.match = function match(pattern, expression, scope) {
	if (pattern.type === 'NoPattern') {
		return true;
	} else if (pattern.type === 'BooleanExpression') {
		return pattern.value === expression.value;
	} else if (pattern.type === 'NumberExpression') {
		return pattern.value === expression.value;
	} else if (pattern.type === 'IdentifierExpression') {
		scope[pattern.name] = expression;
		return true;
	} else if (pattern.type === 'ObjectExpression') {
		var patternIndex = 0;
		var expressionIndex = 0;
		var restElement = 0;

		while (patternIndex < pattern.properties.length && expressionIndex < Object.keys(expression.value).length) {
			var p = pattern.properties[patternIndex].property;
			var propName = Object.keys(expression.value)[expressionIndex];
			var e = expression.value[propName];

			if (p.type === 'RestElement') {
				scope[p.value.name] = scope[p.value.name] || {
					value: {},
					type: 'Object'
				};
				scope[p.value.name].value[propName] = e;
				restElement = 1;
				expressionIndex++;
			} else {
				if (!match(p, e, scope)) {
					return false;
				}

				patternIndex++;
				expressionIndex++;
			}
		}

		return expressionIndex === Object.keys(expression.value).length && patternIndex + restElement === pattern.properties.length;
	} else if (pattern.type === 'ArrayExpression') {
		if (pattern.values.length === 0) {
			return expression.value.length === 0;
		}

		var lastElement = pattern.values[pattern.values.length - 1];
		var _restElement = lastElement.type === 'RestElement' ? lastElement : false;

		if (_restElement) {
			for (var i = 0; i < pattern.values.length - 1; i++) {
				var _p = pattern.values[i];
				var _e = expression.value[i];

				if (!match(_p, _e, scope)) {
					return false;
				}
			}

			scope[_restElement.value.name] = scope[_restElement.value.name] || {
				value: expression.value.slice(pattern.values.length - 1),
				type: 'Array'
			};
			return true;
		} else {
			for (var _i = 0; _i < pattern.values.length; _i++) {
				var _p2 = pattern.values[_i];
				var _e2 = expression.value[_i];

				if (!match(_p2, _e2, scope)) {
					return false;
				}
			}

			return pattern.values.length === expression.value.length;
		}
	}

	return false;
};