'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var createFunctionFactory = exports.createFunctionFactory = function createFunctionFactory(_ref) {
	var transpile = _ref.transpile;

	var createFunction = function createFunction(node) {
		var body = node.body;

		var parameters = node.parameters.map(transpile);
		return ['createFunction([' + parameters.map(function (p) {
			return '\'' + p + '\'';
		}).join(', ') + ']', ', ({ ' + parameters.join(', ') + ' }) => ' + transpile(body), ')'].join('');
	};

	return createFunction;
};