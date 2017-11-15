"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var Node = exports.Node = function Node(value, next) {
	return {
		value: value,
		next: next,
		length: 1 + next ? next.length : 0
	};
};

var cons = exports.cons = function cons(node, next) {
	if (next === null) {
		return node;
	}

	node.next = next;
	node.length = 1 + next.length;
	return node;
};

var length = exports.length = function length(node) {
	return node.length;
};