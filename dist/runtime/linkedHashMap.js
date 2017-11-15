'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.get = exports.add = exports.merge = exports.Node = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _linkedList = require('./linkedList');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Node = exports.Node = function Node() {
	return {
		hashMap: {},
		linkedList: (0, _linkedList.Node)()
	};
};

var merge = exports.merge = function merge(node1, node2) {
	var hashMap = {};
	var length = 0;

	for (var i = 0; i < node1.length; i++) {
		var key = node1.head;
		var value = node1.hashMap[key];

		hashMap[key] = value;
		length += 1;
	}

	return {
		hashMap: hashMap,
		length: length
	};
};

var add = exports.add = function add(node, key, value) {
	var linkedList = key in node.hashMap ? node.linkedList : add(node.linkedList, key);

	return {
		hashMap: _extends({}, node.hashMap, _defineProperty({}, key, value)),
		linkedList: linkedList
	};
};

var get = exports.get = function get(node, key) {
	if (key in node.hashMap) {
		return node.hashMap[key];
	}

	throw key + ' not present in hash map';
};