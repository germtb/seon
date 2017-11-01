'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var createFunctionFactory = exports.createFunctionFactory = function createFunctionFactory(_ref) {
	var aval = _ref.aval;

	var createFunction = function createFunction(definitions, body, scopes) {
		return {
			call: function call(params) {
				var hydratedparams = {};
				var leftDefinitions = [].concat(_toConsumableArray(definitions));

				var _loop = function _loop(i) {
					var param = params[i];

					if (param.type === 'NamedParameter') {
						var definition = leftDefinitions.find(function (definition) {
							return definition.name === param.name;
						});
						leftDefinitions = leftDefinitions.filter(function (definition) {
							return definition.name !== param.name;
						});

						hydratedparams[definition.name] = param.value;
					} else {
						var _definition = leftDefinitions.shift();
						hydratedparams[_definition.name] = param;
					}
				};

				for (var i = 0; i < params.length; i++) {
					_loop(i);
				}

				if (leftDefinitions.length > 0) {
					return createFunction(leftDefinitions, body, [].concat(_toConsumableArray(scopes), [hydratedparams]));
				}

				return aval(body, [].concat(_toConsumableArray(scopes), [hydratedparams]));
			},
			type: 'Function'
		};
	};

	return createFunction;
};