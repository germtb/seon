'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.run = exports.aval = undefined;

var _tokenizer = require('../tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _parser = require('../parser');

var _parser2 = _interopRequireDefault(_parser);

var _visitorsFactory = require('./visitorsFactory');

var _patternMatching = require('./patternMatching');

var _scopes = require('./scopes');

var _createFunction = require('./createFunction');

var _operations = require('./operations');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createEval = function createEval() {
	var aval = function aval(node) {
		var scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [{}];

		var type = node.type;
		var visitor = visitors[type];

		if (!visitor) {
			return type + ' is not a visitor';
		}

		try {
			return visitor(node, scopes);
		} catch (error) {
			return error;
		}
	};

	var createFunction = (0, _createFunction.createFunctionFactory)({ aval: aval });

	var visitors = (0, _visitorsFactory.visitorsFactory)({
		aval: aval,
		get: _scopes.get,
		set: _scopes.set,
		createFunction: createFunction,
		match: _patternMatching.match,
		operations: _operations.operations
	});

	return aval;
};

var aval = exports.aval = createEval();

var run = exports.run = function run(code) {
	var tokens = (0, _tokenizer2.default)(code);
	var nodes = (0, _parser2.default)(tokens);
	return aval(nodes);
};