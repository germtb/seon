"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var traverse = exports.traverse = function traverse(node, visitors, acc) {
	var visitor = visitors[node.type];

	if (visitor && visitor.flatMap) {
		return { array: true, values: visitor.flatMap(node, acc) };
	} else if (visitor && visitor.map) {
		return visitor.map(node, acc);
	}

	if (visitor && visitor.enter) {
		visitor.enter(node, acc);
	}

	var result = node.flatMapChildren(function (c) {
		return traverse(c, visitors, acc);
	});

	if (visitor && visitor.exit) {
		visitor.exit(node, acc);
	}

	return [result];
};