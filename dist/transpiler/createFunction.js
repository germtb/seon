'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var createFunctionFactory = exports.createFunctionFactory = function createFunctionFactory(_ref) {
	var transpile = _ref.transpile;

	var createFunction = function createFunction(node) {
		var body = node.body;

		var openWrap = body.type === 'ObjectExpression' ? '(' : '';
		var closeWrap = body.type === 'ObjectExpression' ? ')' : '';
		var parameters = node.parameters.map(transpile);
		var params = parameters.length === 0 ? '' : '{ ' + parameters.join(', ') + ' }';
		return ['createFunction([' + parameters.map(function (p) {
			return '\'' + p + '\'';
		}).join(', ') + ']', ', (' + params + ') => ' + openWrap + transpile(body) + closeWrap, ')'].join('');
	};

	return createFunction;
};