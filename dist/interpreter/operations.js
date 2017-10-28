'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var sameTypeCheck = function sameTypeCheck(left, right) {
	if (left.type !== right.type) {
		console.error('Cannot sum two nodes of types ' + left.type + ' and ' + right.type);
	}
};

var operations = exports.operations = {
	'+': function _(left, right) {
		sameTypeCheck(left, right);
		return { value: left.value + right.value, type: left.type };
	},
	'-': function _(left, right) {
		sameTypeCheck(left, right);
		return { value: left.value - right.value, type: left.type };
	},
	'*': function _(left, right) {
		sameTypeCheck(left, right);
		return { value: left.value * right.value, type: left.type };
	},
	'/': function _(left, right) {
		sameTypeCheck(left, right);
		return { value: left.value / right.value, type: left.type };
	},
	'%': function _(left, right) {
		sameTypeCheck(left, right);
		return { value: left.value % right.value, type: left.type };
	},
	'|>': function _(left, right) {
		if (left.type !== 'Function') {
			console.error('Node of type ' + left.type + ' is not a function and cannot be called');
		}
		return left.call(right);
	},
	'**': function _() {
		throw new Error('** not implemented');
	},
	'<': function _(left, right) {
		return left < right;
	},
	'>': function _(left, right) {
		return left > right;
	},
	'>=': function _(left, right) {
		return left >= right;
	},
	'<=': function _(left, right) {
		return left <= right;
	},
	'==': function _(left, right) {
		return left == right;
	},
	'!=': function _(left, right) {
		return left != right;
	},
	'&&': function _(left, right) {
		return left && right;
	},
	'||': function _(left, right) {
		return left || right;
	}
};