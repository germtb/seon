'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.run = exports.transpile = undefined;

var _prettier = require('prettier');

var _tokenizer = require('../tokenizer');

var _tokenizer2 = _interopRequireDefault(_tokenizer);

var _parser = require('../parser');

var _parser2 = _interopRequireDefault(_parser);

var _resolveImports = require('../ast/transforms/resolveImports/resolveImports');

var _visitorsFactory = require('./visitorsFactory');

var _createFunction = require('./createFunction');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTranspile = function createTranspile() {
	var transpile = function transpile(node) {
		var internals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		var type = node.type;
		var visitor = visitors[type];

		if (!visitor) {
			return type + ' is not a visitor';
		}

		return visitor(node, internals);
	};

	var run = function run(code, pwd) {
		var tokens = (0, _tokenizer2.default)(code);
		var ast = (0, _parser2.default)(tokens);
		var resolvedAST = (0, _resolveImports.resolveImports)(ast, pwd);
		var transpiledCode = transpile(resolvedAST);
		return (0, _prettier.format)(transpiledCode, {
			semi: false
		});
	};

	var createFunction = (0, _createFunction.createFunctionFactory)({ transpile: transpile });

	var visitors = (0, _visitorsFactory.visitorsFactory)({
		transpile: transpile,
		run: run,
		createFunction: createFunction
	});

	return { transpile: transpile, run: run };
};

var _createTranspile = createTranspile(),
    transpile = _createTranspile.transpile,
    run = _createTranspile.run;

exports.transpile = transpile;
exports.run = run;