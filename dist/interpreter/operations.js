'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var sameTypeCheck = function sameTypeCheck(left, right) {
	if (left.type !== right.type) {
		var error = 'Cannot sum two nodes of types ' + left.type + ' and ' + right.type;
		throw new Error(error);
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
			throw new Error('Node of type ' + left.type + ' is not a function and cannot be called');
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