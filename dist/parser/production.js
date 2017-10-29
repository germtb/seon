'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Production = exports.Production = function () {
	function Production(terminals, generator) {
		var onPeek = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
			return true;
		};

		_classCallCheck(this, Production);

		this.terminals = terminals;
		this.generator = generator;
		this.onPeek = onPeek;
	}

	_createClass(Production, [{
		key: 'matches',
		value: function matches(nodes, peek) {
			var _this = this;

			var nodeTypes = nodes.map(function (r) {
				return r.type;
			});
			return this.terminals.length === nodeTypes.length && nodeTypes.reduce(function (acc, node, index) {
				return acc && _matches(node, _this.terminals[index]);
			}, true) && this.onPeek.apply(this, [peek].concat(_toConsumableArray(nodes)));
		}
	}]);

	return Production;
}();

var matchTable = {
	// Nodes
	Node: ['Node'],
	File: ['File', 'Node'],
	ObjectProperty: ['ObjectProperty', 'Node'],
	BinaryOperator: ['BinaryOperator', 'Node'],
	UnaryOperator: ['UnaryOperator', 'Node'],
	NamedParameter: ['NamedParameter', 'Node'],
	RestElement: ['RestElement', 'Node'],

	// Patterns
	Pattern: ['Pattern', 'Node'],
	PatternCase: ['PatternCase', 'Node'],
	NoPattern: ['NoPattern', 'Expression', 'Node'],

	// Statements
	Statement: ['Statement', 'Node'],
	Declaration: ['Declaration', 'Statement', 'Node'],
	ImportDeclaration: ['ImportDeclaration', 'Statement', 'Node'],

	// Expressions
	Expression: ['Expression', 'Node'],
	IdentifierExpression: ['IdentifierExpression', 'Expression', 'Node'],
	BooleanExpression: ['BooleanExpression', 'Expression', 'Node'],
	NumberExpression: ['NumberExpression', 'Expression', 'Node'],
	StringExpression: ['StringExpression', 'Expression', 'Node'],
	ArrayExpression: ['ArrayExpression', 'Expression', 'Node'],
	ObjectExpression: ['ObjectExpression', 'Expression', 'Node'],
	ObjectAccessExpression: ['ObjectAccessExpression', 'Expression', 'Node'],
	FunctionExpression: ['FunctionExpression', 'Expression', 'Node'],
	CallExpression: ['CallExpression', 'Expression', 'Node'],
	BinaryExpression: ['BinaryExpression', 'Expression', 'Node'],
	UnaryExpression: ['UnaryExpression', 'Expression', 'Node'],
	PatternExpression: ['PatternExpression', 'Expression', 'Node'],
	LetExpression: ['LetExpression', 'Expression', 'Node']
};

var _matches = function _matches(node, type) {
	if (type === '||' && node === '||') {
		return true;
	} else if (type === '|' && node === '|') {
		return true;
	} else if (type === '|>' && node === '|>') {
		return true;
	}

	return type.split('|').some(function (type) {
		if (matchTable[node]) {
			return matchTable[node].includes(type);
		} else {
			return node === type;
		}
	});
};