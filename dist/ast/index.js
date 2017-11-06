"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var visitFactory = exports.visitFactory = function visitFactory(visitors) {
	var visit = function visit(node, acc) {
		var visitor = visitors[node.type];
		if (visitor) {
			visitor(node, acc, visit);
		}
	};

	return visit;
};