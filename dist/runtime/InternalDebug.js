'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var toJSString = require('./InternalCore').toJSString;

exports.log = {
	type: 'Function',
	call: function call(params) {
		var _console;

		// eslint-disable-next-line
		(_console = console).log.apply(_console, _toConsumableArray(params.map(function (p) {
			return toJSString(p);
		})));
		return { type: 'Object', value: { type: 'IO' } };
	}
};