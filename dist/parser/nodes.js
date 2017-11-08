'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = exports.Node = function Node(type) {
	_classCallCheck(this, Node);

	this.type = type;
};

var Expression = exports.Expression = function (_Node) {
	_inherits(Expression, _Node);

	function Expression(type) {
		_classCallCheck(this, Expression);

		return _possibleConstructorReturn(this, (Expression.__proto__ || Object.getPrototypeOf(Expression)).call(this, type));
	}

	return Expression;
}(Node);

var Statement = exports.Statement = function (_Node2) {
	_inherits(Statement, _Node2);

	function Statement(type) {
		_classCallCheck(this, Statement);

		return _possibleConstructorReturn(this, (Statement.__proto__ || Object.getPrototypeOf(Statement)).call(this, type));
	}

	return Statement;
}(Node);

var File = exports.File = function (_Node3) {
	_inherits(File, _Node3);

	function File(nodes) {
		_classCallCheck(this, File);

		var _this3 = _possibleConstructorReturn(this, (File.__proto__ || Object.getPrototypeOf(File)).call(this, 'File'));

		_this3.nodes = nodes;
		return _this3;
	}

	return File;
}(Node);

var IdentifierExpression = exports.IdentifierExpression = function (_Node4) {
	_inherits(IdentifierExpression, _Node4);

	function IdentifierExpression(name) {
		_classCallCheck(this, IdentifierExpression);

		var _this4 = _possibleConstructorReturn(this, (IdentifierExpression.__proto__ || Object.getPrototypeOf(IdentifierExpression)).call(this, 'IdentifierExpression'));

		_this4.name = name;
		return _this4;
	}

	return IdentifierExpression;
}(Node);

var BooleanExpression = exports.BooleanExpression = function (_Expression) {
	_inherits(BooleanExpression, _Expression);

	function BooleanExpression(value) {
		_classCallCheck(this, BooleanExpression);

		var _this5 = _possibleConstructorReturn(this, (BooleanExpression.__proto__ || Object.getPrototypeOf(BooleanExpression)).call(this, 'BooleanExpression'));

		_this5.value = value;
		return _this5;
	}

	return BooleanExpression;
}(Expression);

var NumberExpression = exports.NumberExpression = function (_Expression2) {
	_inherits(NumberExpression, _Expression2);

	function NumberExpression(value) {
		_classCallCheck(this, NumberExpression);

		var _this6 = _possibleConstructorReturn(this, (NumberExpression.__proto__ || Object.getPrototypeOf(NumberExpression)).call(this, 'NumberExpression'));

		_this6.value = value;
		return _this6;
	}

	return NumberExpression;
}(Expression);

var StringExpression = exports.StringExpression = function (_Expression3) {
	_inherits(StringExpression, _Expression3);

	function StringExpression(value) {
		_classCallCheck(this, StringExpression);

		var _this7 = _possibleConstructorReturn(this, (StringExpression.__proto__ || Object.getPrototypeOf(StringExpression)).call(this, 'StringExpression'));

		_this7.value = value;
		return _this7;
	}

	return StringExpression;
}(Expression);

var ArrayExpression = exports.ArrayExpression = function (_Expression4) {
	_inherits(ArrayExpression, _Expression4);

	function ArrayExpression(values) {
		_classCallCheck(this, ArrayExpression);

		var _this8 = _possibleConstructorReturn(this, (ArrayExpression.__proto__ || Object.getPrototypeOf(ArrayExpression)).call(this, 'ArrayExpression'));

		_this8.values = values;
		return _this8;
	}

	return ArrayExpression;
}(Expression);

var ObjectExpression = exports.ObjectExpression = function (_Expression5) {
	_inherits(ObjectExpression, _Expression5);

	function ObjectExpression(properties) {
		_classCallCheck(this, ObjectExpression);

		var _this9 = _possibleConstructorReturn(this, (ObjectExpression.__proto__ || Object.getPrototypeOf(ObjectExpression)).call(this, 'ObjectExpression'));

		_this9.properties = properties;
		return _this9;
	}

	return ObjectExpression;
}(Expression);

var ObjectProperty = exports.ObjectProperty = function (_Node5) {
	_inherits(ObjectProperty, _Node5);

	function ObjectProperty(property) {
		_classCallCheck(this, ObjectProperty);

		var _this10 = _possibleConstructorReturn(this, (ObjectProperty.__proto__ || Object.getPrototypeOf(ObjectProperty)).call(this, 'ObjectProperty'));

		_this10.property = property;
		return _this10;
	}

	return ObjectProperty;
}(Node);

var ObjectAccessExpression = exports.ObjectAccessExpression = function (_Node6) {
	_inherits(ObjectAccessExpression, _Node6);

	function ObjectAccessExpression(expression, accessIdentifier) {
		_classCallCheck(this, ObjectAccessExpression);

		var _this11 = _possibleConstructorReturn(this, (ObjectAccessExpression.__proto__ || Object.getPrototypeOf(ObjectAccessExpression)).call(this, 'ObjectAccessExpression'));

		_this11.expression = expression;
		_this11.accessIdentifier = accessIdentifier;
		return _this11;
	}

	return ObjectAccessExpression;
}(Node);

var BinaryOperator = exports.BinaryOperator = function (_Node7) {
	_inherits(BinaryOperator, _Node7);

	function BinaryOperator(operator) {
		_classCallCheck(this, BinaryOperator);

		var _this12 = _possibleConstructorReturn(this, (BinaryOperator.__proto__ || Object.getPrototypeOf(BinaryOperator)).call(this, 'BinaryOperator'));

		_this12.operator = operator;
		return _this12;
	}

	return BinaryOperator;
}(Node);

var BinaryExpression = exports.BinaryExpression = function (_Expression6) {
	_inherits(BinaryExpression, _Expression6);

	function BinaryExpression(left, operator, right) {
		_classCallCheck(this, BinaryExpression);

		var _this13 = _possibleConstructorReturn(this, (BinaryExpression.__proto__ || Object.getPrototypeOf(BinaryExpression)).call(this, 'BinaryExpression'));

		_this13.left = left;
		_this13.operator = operator;
		_this13.right = right;
		return _this13;
	}

	return BinaryExpression;
}(Expression);

var UnaryOperator = exports.UnaryOperator = function (_Node8) {
	_inherits(UnaryOperator, _Node8);

	function UnaryOperator(operator) {
		_classCallCheck(this, UnaryOperator);

		var _this14 = _possibleConstructorReturn(this, (UnaryOperator.__proto__ || Object.getPrototypeOf(UnaryOperator)).call(this, 'UnaryOperator'));

		_this14.operator = operator;
		return _this14;
	}

	return UnaryOperator;
}(Node);

var UnaryExpression = exports.UnaryExpression = function (_Expression7) {
	_inherits(UnaryExpression, _Expression7);

	function UnaryExpression(operator, expression) {
		_classCallCheck(this, UnaryExpression);

		var _this15 = _possibleConstructorReturn(this, (UnaryExpression.__proto__ || Object.getPrototypeOf(UnaryExpression)).call(this, 'UnaryExpression'));

		_this15.operator = operator;
		_this15.expression = expression;
		return _this15;
	}

	return UnaryExpression;
}(Expression);

var RestElement = exports.RestElement = function (_Node9) {
	_inherits(RestElement, _Node9);

	function RestElement(value) {
		_classCallCheck(this, RestElement);

		var _this16 = _possibleConstructorReturn(this, (RestElement.__proto__ || Object.getPrototypeOf(RestElement)).call(this, 'RestElement'));

		_this16.value = value;
		return _this16;
	}

	return RestElement;
}(Node);

var NamedParameter = exports.NamedParameter = function (_Node10) {
	_inherits(NamedParameter, _Node10);

	function NamedParameter(name, value) {
		_classCallCheck(this, NamedParameter);

		var _this17 = _possibleConstructorReturn(this, (NamedParameter.__proto__ || Object.getPrototypeOf(NamedParameter)).call(this, 'NamedParameter'));

		_this17.name = name;
		_this17.value = value;
		return _this17;
	}

	return NamedParameter;
}(Node);

var FunctionExpression = exports.FunctionExpression = function (_Expression8) {
	_inherits(FunctionExpression, _Expression8);

	function FunctionExpression(parameters, body) {
		_classCallCheck(this, FunctionExpression);

		var _this18 = _possibleConstructorReturn(this, (FunctionExpression.__proto__ || Object.getPrototypeOf(FunctionExpression)).call(this, 'FunctionExpression'));

		_this18.parameters = parameters;
		_this18.body = body;
		return _this18;
	}

	return FunctionExpression;
}(Expression);

var CallExpression = exports.CallExpression = function (_Expression9) {
	_inherits(CallExpression, _Expression9);

	function CallExpression(callee, parameters) {
		_classCallCheck(this, CallExpression);

		var _this19 = _possibleConstructorReturn(this, (CallExpression.__proto__ || Object.getPrototypeOf(CallExpression)).call(this, 'CallExpression'));

		_this19.callee = callee;
		_this19.parameters = parameters;
		return _this19;
	}

	return CallExpression;
}(Expression);

var NoPattern = exports.NoPattern = function (_Expression10) {
	_inherits(NoPattern, _Expression10);

	function NoPattern() {
		_classCallCheck(this, NoPattern);

		return _possibleConstructorReturn(this, (NoPattern.__proto__ || Object.getPrototypeOf(NoPattern)).call(this, 'NoPattern'));
	}

	return NoPattern;
}(Expression);

var PatternCase = exports.PatternCase = function (_Node11) {
	_inherits(PatternCase, _Node11);

	function PatternCase(pattern, result) {
		_classCallCheck(this, PatternCase);

		var _this21 = _possibleConstructorReturn(this, (PatternCase.__proto__ || Object.getPrototypeOf(PatternCase)).call(this, 'PatternCase'));

		_this21.pattern = pattern;
		_this21.result = result;
		return _this21;
	}

	return PatternCase;
}(Node);

var PatternExpression = exports.PatternExpression = function (_Node12) {
	_inherits(PatternExpression, _Node12);

	function PatternExpression(expression, patternCases) {
		_classCallCheck(this, PatternExpression);

		var _this22 = _possibleConstructorReturn(this, (PatternExpression.__proto__ || Object.getPrototypeOf(PatternExpression)).call(this, 'PatternExpression'));

		_this22.expression = expression;
		_this22.patternCases = patternCases;
		return _this22;
	}

	return PatternExpression;
}(Node);

var Declaration = exports.Declaration = function (_Statement) {
	_inherits(Declaration, _Statement);

	function Declaration(declarator, value) {
		_classCallCheck(this, Declaration);

		var _this23 = _possibleConstructorReturn(this, (Declaration.__proto__ || Object.getPrototypeOf(Declaration)).call(this, 'Declaration'));

		_this23.declarator = declarator;
		_this23.value = value;
		return _this23;
	}

	return Declaration;
}(Statement);

var ImportDeclaration = exports.ImportDeclaration = function (_Statement2) {
	_inherits(ImportDeclaration, _Statement2);

	function ImportDeclaration(declarator, path) {
		_classCallCheck(this, ImportDeclaration);

		var _this24 = _possibleConstructorReturn(this, (ImportDeclaration.__proto__ || Object.getPrototypeOf(ImportDeclaration)).call(this, 'ImportDeclaration'));

		_this24.declarator = declarator;
		_this24.path = path;
		return _this24;
	}

	return ImportDeclaration;
}(Statement);

var LetExpression = exports.LetExpression = function (_Expression11) {
	_inherits(LetExpression, _Expression11);

	function LetExpression(declarations, expression) {
		_classCallCheck(this, LetExpression);

		var _this25 = _possibleConstructorReturn(this, (LetExpression.__proto__ || Object.getPrototypeOf(LetExpression)).call(this, 'LetExpression'));

		_this25.declarations = declarations;
		_this25.expression = expression;
		return _this25;
	}

	return LetExpression;
}(Expression);