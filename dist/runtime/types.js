'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var IdentifierExpression = exports.IdentifierExpression = function IdentifierExpression(name) {
	return {
		type: 'IdentifierExpression',
		name: name
	};
};

var RestElement = exports.RestElement = function RestElement(name) {
	return {
		type: 'RestElement',
		value: {
			name: name
		}
	};
};

var ObjectExpression = exports.ObjectExpression = function ObjectExpression(properties) {
	return {
		type: 'ObjectExpression',
		properties: properties
	};
};