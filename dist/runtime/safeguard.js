'use strict';

var safeguard = function safeguard(value) {
	if (value === null || value === undefined || value === NaN) {
		return Nothing();
	} else if (typeof value === 'function') {
		return function (args) {
			try {
				return safeguard(value(args));
			} catch (e) {
				return Err(e);
			}
		};
	} else {
		return Just(value);
	}
};