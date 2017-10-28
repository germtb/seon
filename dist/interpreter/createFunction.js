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
				var hydratedParams = [];
				var leftDefinitions = [].concat(_toConsumableArray(definitions));

				var _loop = function _loop(i) {
					var param = params[i];

					if (/Expression/.test(param.type)) {
						var definition = leftDefinitions.shift();
						hydratedParams[definition.name] = aval(param, scopes);
					} else if (param.type === 'NamedParameter') {
						var _definition = leftDefinitions.find(function (definition) {
							return definition.name === param.name;
						});
						leftDefinitions = leftDefinitions.filter(function (definition) {
							return definition.name !== param.name;
						});

						hydratedParams[_definition.name] = aval(param.value, scopes);
					}
				};

				for (var i = 0; i < params.length; i++) {
					_loop(i);
				}

				if (leftDefinitions.length > 0) {
					return createFunction(leftDefinitions, body, [].concat(_toConsumableArray(scopes), [hydratedParams]));
				}

				return aval(body, [].concat(_toConsumableArray(scopes), [hydratedParams]));
			},
			type: 'Function'
		};
	};

	return createFunction;
};