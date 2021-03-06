'use strict';

exports.internalKeys = {
	type: 'Function',
	call: function call(params) {
		return { type: 'Array', values: Object.keys(params[0]) };
	}
};

exports.internalGet = {
	type: 'Function',
	call: function call(params) {
		var key = params[0].value;
		var dict = params[1].value;
		if (key in dict) {
			return {
				type: 'Object',
				value: {
					type: 'Just',
					value: dict[key]
				}
			};
		} else {
			return {
				type: 'Object',
				value: { type: 'Nothing' }
			};
		}
	}
};