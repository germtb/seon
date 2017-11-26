'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var internalLog = exports.internalLog = function internalLog(params) {
	var _console;

	(_console = console).log.apply(_console, _toConsumableArray(params.map(function (p) {
		return internalToJSString(p);
	})));
	return { type: 'Object', value: { type: 'IO' } };
};

// export const internalLog = {
// 	type: 'Function',
// 	call: params => {
// 		console.log(...params.map(p => internalToJSString(p)))
// 		return { type: 'Object', value: { type: 'IO' } }
// 	}
// }