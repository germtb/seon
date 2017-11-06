'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var match = exports.match = function match(expression, pattern) {
	var matchedParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	if (pattern.type === 'NoPattern') {
		return true;
	} else if (typeof pattern === 'boolean') {
		return pattern === expression;
	} else if (typeof pattern === 'number') {
		return pattern === expression;
	} else if (typeof pattern === 'string') {
		return pattern === expression;
	} else if (pattern.type === 'IdentifierExpression') {
		matchedParams[pattern.name] = expression;
		return true;
	} else if (pattern.type === 'ObjectExpression') {
		if ((typeof expression === 'undefined' ? 'undefined' : _typeof(expression)) !== 'object' || Array.isArray(expression)) {
			return false;
		}

		if (pattern.properties.length === 0) {
			return Object.keys(expression).length === 0;
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
				var e = expression[p.name];

				if (!match(e, p, matchedParams)) {
					return false;
				}
			}

			matchedParams[restElement.property.value.name] = Object.keys(expression).reduce(function (acc, e) {
				if (!notRestElements.find(function (x) {
					return x.property.name === e;
				})) {
					acc[e] = expression[e];
				}
				return acc;
			}, {});

			return true;
		} else {
			for (var _i = 0; _i < notRestElements.length; _i++) {
				var _p = notRestElements[_i].property;
				var _e = expression[_p.name];

				if (!match(_e, _p, matchedParams)) {
					return false;
				}
			}

			return notRestElements.length === Object.keys(expression).length;
		}
	} else if (Array.isArray(pattern)) {
		if (!Array.isArray(expression)) {
			return false;
		}

		if (pattern.length === 0) {
			return expression.length === 0;
		}

		var lastElement = pattern[pattern.length - 1];
		var _restElement = lastElement.type === 'RestElement' ? lastElement : false;

		if (_restElement) {
			for (var _i2 = 0; _i2 < pattern.length - 1; _i2++) {
				var _p2 = pattern[_i2];
				var _e2 = expression[_i2];

				if (_e2 === null || _e2 === undefined || !match(_e2, _p2, matchedParams)) {
					return false;
				}
			}

			matchedParams[_restElement.value.name] = matchedParams[_restElement.value.name] || expression.slice(pattern.length - 1);

			return true;
		} else {
			for (var _i3 = 0; _i3 < pattern.length; _i3++) {
				var _p3 = pattern[_i3];
				var _e3 = expression[_i3];

				if (!match(_e3, _p3, matchedParams)) {
					return false;
				}
			}

			return pattern.length === expression.length;
		}
	}

	return false;
};

var matchExpression = exports.matchExpression = function matchExpression(expression, cases) {
	for (var i = 0; i < cases.length; i++) {
		var pattern = cases[i].pattern;
		var matchedParams = {};
		var matched = match(expression, pattern, matchedParams);

		if (matched) {
			return cases[i].result(matchedParams);
		}
	}

	throw 'Match expression did not match';
};