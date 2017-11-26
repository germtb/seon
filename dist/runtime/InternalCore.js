'use strict';

var toJSString = function toJSString(x) {
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
			return '{ ' + keys[0] + ': ' + toJSString(x.value[keys[0]]) + ' }';
		}

		return '{\n' + keys.map(function (key) {
			return '' + (tabulation + '  ') + key + ': ' + toJSString(x.value[key], tabulation + '  ');
		}).join(',\n') + '\n}';
	} else if (x.type === 'Array') {
		return '[' + x.value.map(toJSString).join(', ') + ']';
	}

	return '';
};

var internalStringify = {
	type: 'Function',
	call: function call(params) {
		return {
			type: 'String',
			value: params.map(function (p) {
				return toJSString(p);
			}).join(' ')
		};
	}
};

var internalType = {
	type: 'Function',
	call: function call(params) {
		return {
			type: 'String',
			value: params[0].type
		};
	}
};