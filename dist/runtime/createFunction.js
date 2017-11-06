'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var createFunction = exports.createFunction = function createFunction(definitions, func) {
	var curriedParams = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	return function (params) {
		var leftDefinitions = [].concat(_toConsumableArray(definitions));
		var hydratedParams = {};

		var _loop = function _loop(i) {
			var param = params[i];

			if (param.type === 'NamedParameter') {
				var definition = leftDefinitions.find(function (definition) {
					return definition === param.name;
				});
				leftDefinitions = leftDefinitions.filter(function (definition) {
					return definition !== param.name;
				});

				hydratedParams[definition] = param.value;
			} else {
				var _definition = leftDefinitions.shift();
				hydratedParams[_definition] = param;
			}
		};

		for (var i = 0; i < params.length; i++) {
			_loop(i);
		}

		var finalParams = _extends({}, curriedParams, hydratedParams);

		if (leftDefinitions.length >= 1) {
			return createFunction(leftDefinitions, func, finalParams);
		}

		return func(finalParams);
	};
};