"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var arrayOf = exports.arrayOf = function arrayOf(type, values) {
	return {
		type: "[" + type + "]",
		values: values
	};
};