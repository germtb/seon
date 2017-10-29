'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.run = exports.transpile = undefined;

var _tokenizer = require('../tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _parser = require('../parser');

var _parser2 = _interopRequireDefault(_parser);

var _visitorsFactory = require('./visitorsFactory');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createEval = function createEval() {
	var transpile = function transpile(node) {
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

	var run = function run(code) {
		var scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [{}];

		var tokens = (0, _tokenizer2.default)(code);
		var nodes = (0, _parser2.default)(tokens);
		return transpile(nodes[0], scopes);
	};

	var visitors = (0, _visitorsFactory.visitorsFactory)({
		transpile: transpile,
		run: run
	});

	return { transpile: transpile, run: run };
};

var _createEval = createEval(),
    transpile = _createEval.transpile,
    run = _createEval.run;

exports.transpile = transpile;
exports.run = run;