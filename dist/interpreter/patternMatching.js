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
		if (pattern.properties.length === 0) {
			return Object.keys(expression.value).length === 0;
		}

		var restElement = pattern.properties.find(function (p) {
			return p.property.type === 'RestElement';
		});
		var notRestElements = pattern.properties.filter(function (p) {
			return p.property.type !== 'RestElement';
		});

		if (restElement) {
			for (var i = 0; i < notRestElements.length; i++) {
				var p = notRestElements[i].property;
				var e = expression.value[p.name];

				if (!match(p, e, scope)) {
					return false;
				}
			}

			scope[restElement.property.value.name] = {
				value: Object.keys(expression.value).reduce(function (acc, e) {
					if (!notRestElements.find(function (x) {
						return x.property.name === e;
					})) {
						acc[e] = expression.value[e];
					}
					return acc;
				}, {}),
				type: 'Object'
			};

			return true;
		} else {
			for (var _i = 0; _i < notRestElements.length; _i++) {
				var _p = notRestElements[_i].property;
				var _e = expression.value[_p.name];

				if (!match(_p, _e, scope)) {
					return false;
				}
			}

			return notRestElements.length === Object.keys(expression.value).length;
		}
	} else if (pattern.type === 'ArrayExpression') {
		if (pattern.values.length === 0) {
			return expression.value.length === 0;
		}

		var lastElement = pattern.values[pattern.values.length - 1];
		var _restElement = lastElement.type === 'RestElement' ? lastElement : false;

		if (_restElement) {
			for (var _i2 = 0; _i2 < pattern.values.length - 1; _i2++) {
				var _p2 = pattern.values[_i2];
				var _e2 = expression.value[_i2];

				if (!match(_p2, _e2, scope)) {
					return false;
				}
			}

			scope[_restElement.value.name] = scope[_restElement.value.name] || {
				value: expression.value.slice(pattern.values.length - 1),
				type: 'Array'
			};
			return true;
		} else {
			for (var _i3 = 0; _i3 < pattern.values.length; _i3++) {
				var _p3 = pattern.values[_i3];
				var _e3 = expression.value[_i3];

				if (!match(_p3, _e3, scope)) {
					return false;
				}
			}

			return pattern.values.length === expression.value.length;
		}
	}

	return false;
};