'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _nodes = require('./nodes');

var _Production = require('./Production');

var _utils = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var nonOperators = ['[', '{', '=>', '(', 'match', '.'];
var unaryOperators = ['not', '-'];
var binaryOperators = ['+', '*', '/', '-', '%', '**', '<', '>', '>=', '<=', '==', '!=', 'and', 'or', '|>'];

var lowestPrecedence = function lowestPrecedence(peek) {
	return !nonOperators.includes(peek) && !unaryOperators.includes(peek) && !binaryOperators.includes(peek);
};

var functionExpressionPrecedence = function functionExpressionPrecedence(peek) {
	return lowestPrecedence(peek) && peek !== '|';
};

var unaryOperatorPrecedence = {
	not: ['|>', '(', '.'],
	'-': ['|>', '(', '.']
};

var binaryOperatorPrecedence = {
	'|>': ['=>', 'not', '('],
	'**': ['=>', 'not', '|>', '('],
	'*': ['=>', 'not', '|>', '(', '**'],
	'/': ['=>', 'not', '|>', '(', '**'],
	'%': ['=>', 'not', '|>', '(', '**'],
	'+': ['=>', 'not', '|>', '(', '**', '*', '%', '/'],
	'-': ['=>', 'not', '|>', '(', '**', '*', '%', '/'],
	'<': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'>': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'>=': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'<=': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'==': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	'!=': ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	and: ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-'],
	or: ['=>', 'not', '|>', '(', '**', '*', '%', '/', '+', '-']
};

var grammar = [].concat(_toConsumableArray(unaryOperators.map(function (o) {
	return new _Production.Production([o], function () {
		return new _nodes.UnaryOperator(o);
	});
})), _toConsumableArray(binaryOperators.map(function (o) {
	return new _Production.Production([o], function () {
		return new _nodes.BinaryOperator(o);
	});
})), [new _Production.Production(['Comment'], function () {
	return [];
}), new _Production.Production(['Identifier'], function (identifier) {
	return new _nodes.IdentifierExpression(identifier.value);
}), new _Production.Production(['Boolean'], function (expression) {
	return new _nodes.BooleanExpression(expression.value);
}), new _Production.Production(['String'], function (expression) {
	return new _nodes.StringExpression(expression.value);
}), new _Production.Production(['Number'], function (expression) {
	return new _nodes.NumberExpression(expression.value);
}),

// Operators
new _Production.Production(['Expression', 'BinaryOperator', 'Expression'], function (left, op, right) {
	return new _nodes.BinaryExpression(left, op, right);
}, function (peek, _, op) {
	return !binaryOperatorPrecedence[op.operator].includes(peek);
}), new _Production.Production(['UnaryOperator', 'Expression'], function (op, expression) {
	return new _nodes.UnaryExpression(op, expression);
}, function (peek, op) {
	return !unaryOperatorPrecedence[op.operator].includes(peek);
}), new _Production.Production(['Expression', 'UnaryOperator'], function (left, operator) {
	return {
		type: 'OpenUnaryExpression',
		left: left,
		operator: operator.operator
	};
}), new _Production.Production(['OpenUnaryExpression', 'Expression'], function (openExpression, right) {
	return new _nodes.BinaryExpression(openExpression.left, new _nodes.BinaryOperator(openExpression.operator), right);
}, function (peek) {
	return !binaryOperatorPrecedence['-'].includes(peek);
}),

// Arrays
new _Production.Production(['[', ']'], function () {
	return new _nodes.ArrayExpression([]);
}), new _Production.Production(['[', 'Expression|RestElement', ']'], function (_, expression) {
	return new _nodes.ArrayExpression([expression]);
}), new _Production.Production(['[', 'Expression|RestElement', ','], function (_, expression) {
	return (0, _utils.arrayOf)('Expression', [expression]);
}), new _Production.Production(['[Expression]', 'Expression|RestElement', ','], function (expressions, expression) {
	return (0, _utils.arrayOf)('Expression', [].concat(_toConsumableArray(expressions.values), [expression]));
}), new _Production.Production(['[Expression]', 'Expression|RestElement', ']'], function (expressions, expression) {
	return new _nodes.ArrayExpression([].concat(_toConsumableArray(expressions.values), [expression]));
}),

// Obejcts
new _Production.Production(['{', '}'], function () {
	return new _nodes.ObjectExpression([]);
}), new _Production.Production(['{', 'IdentifierExpression|NamedParameter|RestElement', '}'], function (_, expression) {
	return new _nodes.ObjectExpression([new _nodes.ObjectProperty(expression, { computed: false })]);
}), new _Production.Production(['{', '#', 'IdentifierExpression|NamedParameter|RestElement', '}'], function (_1, _2, expression) {
	return new _nodes.ObjectExpression([new _nodes.ObjectProperty(expression, { computed: true })]);
}), new _Production.Production(['{', 'IdentifierExpression|NamedParameter|RestElement', ','], function (_, expression) {
	return (0, _utils.arrayOf)('ObjectProperty', [new _nodes.ObjectProperty(expression, { computed: false })]);
}), new _Production.Production(['{', '#', 'IdentifierExpression|NamedParameter|RestElement', ','], function (_1, _2, expression) {
	return (0, _utils.arrayOf)('ObjectProperty', [new _nodes.ObjectProperty(expression, { computed: true })]);
}), new _Production.Production(['[ObjectProperty]', 'IdentifierExpression|NamedParameter|RestElement', ','], function (properties, expression) {
	return (0, _utils.arrayOf)('ObjectProperty', [].concat(_toConsumableArray(properties.values), [new _nodes.ObjectProperty(expression, { computed: false })]));
}), new _Production.Production(['[ObjectProperty]', '#', 'IdentifierExpression|NamedParameter|RestElement', ','], function (properties, _, expression) {
	return (0, _utils.arrayOf)('ObjectProperty', [].concat(_toConsumableArray(properties.values), [new _nodes.ObjectProperty(expression, { computed: true })]));
}), new _Production.Production(['[ObjectProperty]', 'IdentifierExpression|NamedParameter|RestElement', '}'], function (expressions, expression) {
	return new _nodes.ObjectExpression([].concat(_toConsumableArray(expressions.values), [new _nodes.ObjectProperty(expression, { computed: false })]));
}), new _Production.Production(['[ObjectProperty]', '#', 'IdentifierExpression|NamedParameter', '}'], function (expressions, _, expression) {
	return new _nodes.ObjectExpression([].concat(_toConsumableArray(expressions.values), [new _nodes.ObjectProperty(expression, { computed: true })]));
}), new _Production.Production(['Expression', '.', 'IdentifierExpression'], function (expression, _, accessor) {
	return new _nodes.ObjectAccessExpression(expression, accessor, {
		computed: false
	});
}), new _Production.Production(['Expression', '#', 'Expression'], function (expression, _, accessor) {
	return new _nodes.ObjectAccessExpression(expression, accessor, {
		computed: true
	});
}),

// NamedParameters
new _Production.Production(['IdentifierExpression', ':', 'Expression'], function (identifier, _, expression) {
	return new _nodes.NamedParameter(identifier.name, expression);
}, lowestPrecedence),

// RestElement
new _Production.Production(['...', 'Expression'], function (a, expression) {
	return new _nodes.RestElement(expression);
}, lowestPrecedence),

// PatternExpressions
new _Production.Production(['PatternExpression', 'PatternCase'], function (patternExpression, patternCase) {
	return new _nodes.PatternExpression(patternExpression.expression, [].concat(_toConsumableArray(patternExpression.patternCases), [patternCase]));
}), new _Production.Production(['match', 'Expression', 'PatternCase'], function (_, expression, patternCase) {
	return new _nodes.PatternExpression(expression, [patternCase]);
}),

// Begin pattern
new _Production.Production(['_'], function () {
	return new _nodes.NoPattern();
}), new _Production.Production(['|', 'NoPattern', '->'], function () {
	return {
		type: 'UnusedPattern',
		pattern: new _nodes.NoPattern()
	};
}), new _Production.Production(['|', 'IdentifierExpression|BooleanExpression|NumberExpression|StringExpression|ArrayExpression|ObjectExpression', '->'], function (_, identifier) {
	return { type: 'UnusedPattern', pattern: identifier };
}), new _Production.Production(['UnusedPattern', 'Expression'], function (_ref, expression) {
	var pattern = _ref.pattern;
	return new _nodes.PatternCase(pattern, expression);
}, lowestPrecedence),

// Functions
new _Production.Production(['Expression', '('], function (expression) {
	return [expression, (0, _utils.arrayOf)('Parameter', [])];
}), new _Production.Production(['Expression', '[Parameter]', ')'], function (expression) {
	return new _nodes.CallExpression(expression, []);
}), new _Production.Production(['(', 'Expression', ')'], function (_, expression) {
	return expression;
}), new _Production.Production(['IdentifierExpression', '=>', 'Expression'], function (identifier, _, body) {
	return new _nodes.FunctionExpression([identifier], body);
}, functionExpressionPrecedence), new _Production.Production(['(', ')'], function () {
	return {
		type: 'ClosedParameters',
		values: []
	};
}), new _Production.Production(['(', 'Expression|NamedParameter|RestElement', ','], function (_, parameter) {
	return (0, _utils.arrayOf)('Parameter', [parameter]);
}), new _Production.Production(['(', 'Expression|NamedParameter|RestElement', ')'], function (_, parameter) {
	return {
		type: 'ClosedParameters',
		values: [parameter]
	};
}), new _Production.Production(['[Parameter]', 'Expression|NamedParameter|RestElement', ','], function (parameters, parameter) {
	return (0, _utils.arrayOf)('Parameter', [].concat(_toConsumableArray(parameters.values), [parameter]));
}), new _Production.Production(['[Parameter]', 'Expression|NamedParameter|RestElement', ')'], function (parameters, parameter) {
	return {
		type: 'ClosedParameters',
		values: [].concat(_toConsumableArray(parameters.values), [parameter])
	};
}), new _Production.Production(['ClosedParameters', '=>', 'Expression'], function (parameters, _, body) {
	return new _nodes.FunctionExpression(parameters.values, body);
}, functionExpressionPrecedence),

// FunctionCalls
new _Production.Production(['Expression', 'ClosedParameters'], function (expression, parameters) {
	return new _nodes.CallExpression(expression, parameters.values);
}),

// Declarations
new _Production.Production(['import', 'NoPattern|ArrayExpression|IdentifierExpression|ObjectExpression', 'from'], function (_, expression) {
	return {
		type: 'OpenImport',
		expression: expression
	};
}), new _Production.Production(['OpenImport', 'StringExpression'], function (openImport, path) {
	return new _nodes.ImportDeclaration(openImport.expression, path);
}), new _Production.Production(['NoPattern|ArrayExpression|IdentifierExpression|ObjectExpression', '=', 'Expression'], function (array, _, expression) {
	return new _nodes.Declaration(array, expression);
}, function (peek) {
	return !['=>', '(', '.'].includes(peek) && !unaryOperators.includes(peek) && !binaryOperators.includes(peek);
}), new _Production.Production(['external', 'IdentifierExpression'], function (_, identifier) {
	return new _nodes.ExternalDeclaration(identifier.name);
}, function (peek) {
	return !['=>', '(', '.'].includes(peek) && !unaryOperators.includes(peek) && !binaryOperators.includes(peek);
}),

// File
new _Production.Production(['Node', '$'], function (statement) {
	return new _nodes.File([statement]);
}), new _Production.Production(['Node', 'File'], function (statement, file) {
	return new _nodes.File([statement].concat(_toConsumableArray(file.nodes)));
}),

// Let
new _Production.Production(['let', 'Declaration'], function (_, declaration) {
	return {
		type: 'OpenLetExpression',
		declarations: [declaration]
	};
}), new _Production.Production(['OpenLetExpression', 'Declaration'], function (openLet, declaration) {
	return {
		type: 'OpenLetExpression',
		declarations: [].concat(_toConsumableArray(openLet.declarations), [declaration])
	};
}), new _Production.Production(['OpenLetExpression', 'in', 'Expression'], function (openLet, _, expression) {
	return new _nodes.LetExpression(openLet.declarations, expression);
}, lowestPrecedence)]);

var parse = function parse(tokens) {
	tokens.push({ type: '$' });
	var stack = [];

	var _loop = function _loop(i) {
		var token = tokens[i];
		var peek = i < tokens.length - 1 ? tokens[i + 1] : {};
		stack.push(token);

		var _loop2 = function _loop2(_j) {
			var nodes = stack.slice(stack.length - _j);
			var production = grammar.find(function (r) {
				return r.matches(nodes, peek.type);
			});

			if (production) {
				var _tokens = stack.splice(stack.length - _j);
				var node = production.generator.apply(production, _toConsumableArray(_tokens));
				stack.push.apply(stack, _toConsumableArray([].concat(node)));
				_j = 0;
			}
			j = _j;
		};

		for (var j = 1; j <= Math.min(4, stack.length); j++) {
			_loop2(j);
		}
	};

	for (var i = 0; i < tokens.length; i++) {
		_loop(i);
	}

	if (stack.length > 1) {
		throw new Error('Parsing error');
	}

	return stack[0];
};

exports.default = parse;