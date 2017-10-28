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
		var _patternIndex = 0;
		var _expressionIndex = 0;
		var _restElement = 0;

		while (_patternIndex < pattern.values.length && _expressionIndex < expression.value.length) {
			var _p = pattern.values[_patternIndex];
			var _e = expression.value[_expressionIndex];

			if (_p.type === 'RestElement') {
				scope[_p.value.name] = scope[_p.value.name] || {
					value: [],
					type: 'Array'
				};
				scope[_p.value.name].value.push(_e);
				_restElement = 1;
				_expressionIndex++;
			} else {
				if (!match(_p, _e, scope)) {
					return false;
				}

				_patternIndex++;
				_expressionIndex++;
			}
		}

		return _expressionIndex === expression.value.length && _patternIndex + _restElement === pattern.values.length;
	}

	console.error('Pattern of type ' + pattern.type + ' not implemented yet');
	return false;
};