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

var createAval = function createAval() {
	var aval = function aval(node) {
		var scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [{}];

		var type = node.type;
		var visitor = visitors[type];

		if (!visitor) {
			return type + ' is not a visitor';
		}

		return visitor(node, scopes);
	};

	var run = function run(code) {
		var scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [{}];

		var tokens = (0, _tokenizer2.default)(code);
		var nodes = (0, _parser2.default)(tokens);
		return aval(nodes[0], scopes);
	};

	var createFunction = (0, _createFunction.createFunctionFactory)({ aval: aval });

	var visitors = (0, _visitorsFactory.visitorsFactory)({
		aval: aval,
		run: run,
		get: _scopes.get,
		set: _scopes.set,
		createFunction: createFunction,
		match: _patternMatching.match,
		operations: _operations.operations
	});

	return { aval: aval, run: run };
};

var _createAval = createAval(),
    aval = _createAval.aval,
    run = _createAval.run;

exports.aval = aval;
exports.run = run;