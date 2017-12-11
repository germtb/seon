'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var createBundle = exports.createBundle = function createBundle(modules) {
	var modulesCache = {};
	var getModule = function getModule(index) {
		if (modulesCache[index] === undefined) {
			modulesCache[index] = modules[index](getModule);
		}
		return modulesCache[index];
	};

	return modules[modules.length - 1](getModule);
};

var internalToJSString = function internalToJSString(x) {
	var tabulation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	if (x.type === 'Number') {
		return x.value;
	} else if (x.type === 'Boolean') {
		return x.value ? 'true' : 'false';
	} else if (x.type === 'String') {
		return '' + x.value;
	} else if (x.type === 'Function') {
		return 'Function';
	} else if (x.type === 'Object') {
		var keys = Object.keys(x.value);
		if (keys.length === 0) {
			return '{}';
		} else if (keys.length === 1) {
			return '{ ' + keys[0] + ': ' + internalToJSString(x.value[keys[0]]) + ' }';
		}

		return '{\n' + keys.map(function (key) {
			return '' + (tabulation + '  ') + key + ': ' + internalToJSString(x.value[key], tabulation + '  ');
		}).join(',\n') + '\n}';
	} else if (x.type === 'Array') {
		return '[' + x.value.map(internalToJSString).join(', ') + ']';
	}

	return '';
};

var internalStringify = exports.internalStringify = {
	type: 'Function',
	call: function call(params) {
		return {
			type: 'String',
			value: params.map(function (p) {
				return internalToJSString(p);
			}).join(' ')
		};
	}
};

var internalType = exports.internalType = {
	type: 'Function',
	call: function call(params) {
		return {
			type: 'String',
			value: params[0].type
		};
	}
};