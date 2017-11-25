"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var traverse = exports.traverse = function traverse(node, visitors, acc) {
	var visitor = visitors[node.type];

	if (visitor && visitor.map) {
		return visitor.map(node, acc);
	}

	if (visitor && visitor.enter) {
		visitor.enter(node, acc);
	}

	var finalNode = node.mapChildren(function (node) {
		return traverse(node, visitors, acc);
	});

	if (visitor && visitor.exit) {
		visitor.exit(node, acc);
	}

	return finalNode;
};