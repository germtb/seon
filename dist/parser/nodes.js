'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = exports.Node = function () {
	function Node(type) {
		_classCallCheck(this, Node);

		this.type = type;
	}

	_createClass(Node, [{
		key: 'mapChildren',
		value: function mapChildren() {
			return this;
		}
	}]);

	return Node;
}();

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

	_createClass(File, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new File(this.nodes.map(function (node) {
				return f(node, acc);
			}));
		}
	}]);

	return File;
}(Node);

var Bundle = exports.Bundle = function (_Node4) {
	_inherits(Bundle, _Node4);

	function Bundle(files) {
		_classCallCheck(this, Bundle);

		var _this4 = _possibleConstructorReturn(this, (Bundle.__proto__ || Object.getPrototypeOf(Bundle)).call(this, 'Bundle'));

		_this4.files = files;
		return _this4;
	}

	_createClass(Bundle, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new Bundle(this.files.map(function (file) {
				return f(file, acc);
			}));
		}
	}]);

	return Bundle;
}(Node);

var IdentifierExpression = exports.IdentifierExpression = function (_Node5) {
	_inherits(IdentifierExpression, _Node5);

	function IdentifierExpression(name) {
		_classCallCheck(this, IdentifierExpression);

		var _this5 = _possibleConstructorReturn(this, (IdentifierExpression.__proto__ || Object.getPrototypeOf(IdentifierExpression)).call(this, 'IdentifierExpression'));

		_this5.name = name;
		return _this5;
	}

	return IdentifierExpression;
}(Node);

var BooleanExpression = exports.BooleanExpression = function (_Expression) {
	_inherits(BooleanExpression, _Expression);

	function BooleanExpression(value) {
		_classCallCheck(this, BooleanExpression);

		var _this6 = _possibleConstructorReturn(this, (BooleanExpression.__proto__ || Object.getPrototypeOf(BooleanExpression)).call(this, 'BooleanExpression'));

		_this6.value = value;
		return _this6;
	}

	return BooleanExpression;
}(Expression);

var NumberExpression = exports.NumberExpression = function (_Expression2) {
	_inherits(NumberExpression, _Expression2);

	function NumberExpression(value) {
		_classCallCheck(this, NumberExpression);

		var _this7 = _possibleConstructorReturn(this, (NumberExpression.__proto__ || Object.getPrototypeOf(NumberExpression)).call(this, 'NumberExpression'));

		_this7.value = value;
		return _this7;
	}

	return NumberExpression;
}(Expression);

var StringExpression = exports.StringExpression = function (_Expression3) {
	_inherits(StringExpression, _Expression3);

	function StringExpression(value) {
		_classCallCheck(this, StringExpression);

		var _this8 = _possibleConstructorReturn(this, (StringExpression.__proto__ || Object.getPrototypeOf(StringExpression)).call(this, 'StringExpression'));

		_this8.value = value;
		return _this8;
	}

	return StringExpression;
}(Expression);

var ArrayExpression = exports.ArrayExpression = function (_Expression4) {
	_inherits(ArrayExpression, _Expression4);

	function ArrayExpression(values) {
		_classCallCheck(this, ArrayExpression);

		var _this9 = _possibleConstructorReturn(this, (ArrayExpression.__proto__ || Object.getPrototypeOf(ArrayExpression)).call(this, 'ArrayExpression'));

		_this9.values = values;
		return _this9;
	}

	_createClass(ArrayExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new ArrayExpression(this.values.map(function (node) {
				return f(node, acc);
			}));
		}
	}]);

	return ArrayExpression;
}(Expression);

var ObjectExpression = exports.ObjectExpression = function (_Expression5) {
	_inherits(ObjectExpression, _Expression5);

	function ObjectExpression(properties) {
		_classCallCheck(this, ObjectExpression);

		var _this10 = _possibleConstructorReturn(this, (ObjectExpression.__proto__ || Object.getPrototypeOf(ObjectExpression)).call(this, 'ObjectExpression'));

		_this10.properties = properties;
		return _this10;
	}

	_createClass(ObjectExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new ObjectExpression(this.properties.map(function (node) {
				return f(node, acc);
			}));
		}
	}]);

	return ObjectExpression;
}(Expression);

var ObjectProperty = exports.ObjectProperty = function (_Node6) {
	_inherits(ObjectProperty, _Node6);

	function ObjectProperty(property, config) {
		_classCallCheck(this, ObjectProperty);

		var _this11 = _possibleConstructorReturn(this, (ObjectProperty.__proto__ || Object.getPrototypeOf(ObjectProperty)).call(this, 'ObjectProperty'));

		_this11.property = property;
		_this11.config = config;
		return _this11;
	}

	_createClass(ObjectProperty, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new ObjectProperty(f(this.property, acc), this.config);
		}
	}]);

	return ObjectProperty;
}(Node);

var ObjectAccessExpression = exports.ObjectAccessExpression = function (_Node7) {
	_inherits(ObjectAccessExpression, _Node7);

	function ObjectAccessExpression(expression, accessIdentifier) {
		_classCallCheck(this, ObjectAccessExpression);

		var _this12 = _possibleConstructorReturn(this, (ObjectAccessExpression.__proto__ || Object.getPrototypeOf(ObjectAccessExpression)).call(this, 'ObjectAccessExpression'));

		_this12.expression = expression;
		_this12.accessIdentifier = accessIdentifier;
		return _this12;
	}

	_createClass(ObjectAccessExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new ObjectAccessExpression(f(this.expression, acc), f(this.accessIdentifier, acc));
		}
	}]);

	return ObjectAccessExpression;
}(Node);

var BinaryOperator = exports.BinaryOperator = function (_Node8) {
	_inherits(BinaryOperator, _Node8);

	function BinaryOperator(operator) {
		_classCallCheck(this, BinaryOperator);

		var _this13 = _possibleConstructorReturn(this, (BinaryOperator.__proto__ || Object.getPrototypeOf(BinaryOperator)).call(this, 'BinaryOperator'));

		_this13.operator = operator;
		return _this13;
	}

	return BinaryOperator;
}(Node);

var BinaryExpression = exports.BinaryExpression = function (_Expression6) {
	_inherits(BinaryExpression, _Expression6);

	function BinaryExpression(left, operator, right) {
		_classCallCheck(this, BinaryExpression);

		var _this14 = _possibleConstructorReturn(this, (BinaryExpression.__proto__ || Object.getPrototypeOf(BinaryExpression)).call(this, 'BinaryExpression'));

		_this14.left = left;
		_this14.operator = operator;
		_this14.right = right;
		return _this14;
	}

	_createClass(BinaryExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new BinaryExpression(f(this.left, acc), f(this.operator, acc), f(this.right, acc));
		}
	}]);

	return BinaryExpression;
}(Expression);

var UnaryOperator = exports.UnaryOperator = function (_Node9) {
	_inherits(UnaryOperator, _Node9);

	function UnaryOperator(operator) {
		_classCallCheck(this, UnaryOperator);

		var _this15 = _possibleConstructorReturn(this, (UnaryOperator.__proto__ || Object.getPrototypeOf(UnaryOperator)).call(this, 'UnaryOperator'));

		_this15.operator = operator;
		return _this15;
	}

	return UnaryOperator;
}(Node);

var UnaryExpression = exports.UnaryExpression = function (_Expression7) {
	_inherits(UnaryExpression, _Expression7);

	function UnaryExpression(operator, expression) {
		_classCallCheck(this, UnaryExpression);

		var _this16 = _possibleConstructorReturn(this, (UnaryExpression.__proto__ || Object.getPrototypeOf(UnaryExpression)).call(this, 'UnaryExpression'));

		_this16.operator = operator;
		_this16.expression = expression;
		return _this16;
	}

	_createClass(UnaryExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new UnaryExpression(f(this.operator, acc), f(this.expression, acc));
		}
	}]);

	return UnaryExpression;
}(Expression);

var RestElement = exports.RestElement = function (_Node10) {
	_inherits(RestElement, _Node10);

	function RestElement(value) {
		_classCallCheck(this, RestElement);

		var _this17 = _possibleConstructorReturn(this, (RestElement.__proto__ || Object.getPrototypeOf(RestElement)).call(this, 'RestElement'));

		_this17.value = value;
		return _this17;
	}

	_createClass(RestElement, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new RestElement(f(this.value, acc));
		}
	}]);

	return RestElement;
}(Node);

var NamedParameter = exports.NamedParameter = function (_Node11) {
	_inherits(NamedParameter, _Node11);

	function NamedParameter(name, value) {
		_classCallCheck(this, NamedParameter);

		var _this18 = _possibleConstructorReturn(this, (NamedParameter.__proto__ || Object.getPrototypeOf(NamedParameter)).call(this, 'NamedParameter'));

		_this18.name = name;
		_this18.value = value;
		return _this18;
	}

	_createClass(NamedParameter, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new NamedParameter(this.name, f(this.value, acc));
		}
	}]);

	return NamedParameter;
}(Node);

var FunctionExpression = exports.FunctionExpression = function (_Expression8) {
	_inherits(FunctionExpression, _Expression8);

	function FunctionExpression(parameters, body) {
		_classCallCheck(this, FunctionExpression);

		var _this19 = _possibleConstructorReturn(this, (FunctionExpression.__proto__ || Object.getPrototypeOf(FunctionExpression)).call(this, 'FunctionExpression'));

		_this19.parameters = parameters;
		_this19.body = body;
		return _this19;
	}

	_createClass(FunctionExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new FunctionExpression(this.parameters.map(function (p) {
				return f(p, acc);
			}), f(this.body, acc));
		}
	}]);

	return FunctionExpression;
}(Expression);

var CallExpression = exports.CallExpression = function (_Expression9) {
	_inherits(CallExpression, _Expression9);

	function CallExpression(callee, parameters) {
		_classCallCheck(this, CallExpression);

		var _this20 = _possibleConstructorReturn(this, (CallExpression.__proto__ || Object.getPrototypeOf(CallExpression)).call(this, 'CallExpression'));

		_this20.callee = callee;
		_this20.parameters = parameters;
		return _this20;
	}

	_createClass(CallExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new CallExpression(f(this.callee, acc), this.parameters.map(function (p) {
				return f(p, acc);
			}));
		}
	}]);

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

var PatternCase = exports.PatternCase = function (_Node12) {
	_inherits(PatternCase, _Node12);

	function PatternCase(pattern, result) {
		_classCallCheck(this, PatternCase);

		var _this22 = _possibleConstructorReturn(this, (PatternCase.__proto__ || Object.getPrototypeOf(PatternCase)).call(this, 'PatternCase'));

		_this22.pattern = pattern;
		_this22.result = result;
		return _this22;
	}

	_createClass(PatternCase, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new PatternCase(f(this.pattern, acc), f(this.result, acc));
		}
	}]);

	return PatternCase;
}(Node);

var PatternExpression = exports.PatternExpression = function (_Node13) {
	_inherits(PatternExpression, _Node13);

	function PatternExpression(expression, patternCases) {
		_classCallCheck(this, PatternExpression);

		var _this23 = _possibleConstructorReturn(this, (PatternExpression.__proto__ || Object.getPrototypeOf(PatternExpression)).call(this, 'PatternExpression'));

		_this23.expression = expression;
		_this23.patternCases = patternCases;
		return _this23;
	}

	_createClass(PatternExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new PatternExpression(f(this.expression, acc), this.patternCases.map(function (p) {
				return f(p, acc);
			}));
		}
	}]);

	return PatternExpression;
}(Node);

var Declaration = exports.Declaration = function (_Statement) {
	_inherits(Declaration, _Statement);

	function Declaration(declarator, value) {
		_classCallCheck(this, Declaration);

		var _this24 = _possibleConstructorReturn(this, (Declaration.__proto__ || Object.getPrototypeOf(Declaration)).call(this, 'Declaration'));

		_this24.declarator = declarator;
		_this24.value = value;
		return _this24;
	}

	_createClass(Declaration, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new Declaration(f(this.declarator, acc), f(this.value, acc));
		}
	}]);

	return Declaration;
}(Statement);

var ExternalDeclaration = exports.ExternalDeclaration = function (_Statement2) {
	_inherits(ExternalDeclaration, _Statement2);

	function ExternalDeclaration(name) {
		_classCallCheck(this, ExternalDeclaration);

		var _this25 = _possibleConstructorReturn(this, (ExternalDeclaration.__proto__ || Object.getPrototypeOf(ExternalDeclaration)).call(this, 'ExternalDeclaration'));

		_this25.name = name;
		return _this25;
	}

	return ExternalDeclaration;
}(Statement);

var ImportDeclaration = exports.ImportDeclaration = function (_Statement3) {
	_inherits(ImportDeclaration, _Statement3);

	function ImportDeclaration(declarator, path) {
		_classCallCheck(this, ImportDeclaration);

		var _this26 = _possibleConstructorReturn(this, (ImportDeclaration.__proto__ || Object.getPrototypeOf(ImportDeclaration)).call(this, 'ImportDeclaration'));

		_this26.declarator = declarator;
		_this26.path = path;
		return _this26;
	}

	_createClass(ImportDeclaration, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new Declaration(f(this.declarator, acc), f(this.path, acc));
		}
	}]);

	return ImportDeclaration;
}(Statement);

var LetExpression = exports.LetExpression = function (_Expression11) {
	_inherits(LetExpression, _Expression11);

	function LetExpression(declarations, expression) {
		_classCallCheck(this, LetExpression);

		var _this27 = _possibleConstructorReturn(this, (LetExpression.__proto__ || Object.getPrototypeOf(LetExpression)).call(this, 'LetExpression'));

		_this27.declarations = declarations;
		_this27.expression = expression;
		return _this27;
	}

	_createClass(LetExpression, [{
		key: 'mapChildren',
		value: function mapChildren(f, acc) {
			return new Declaration(this.declarations.map(function (d) {
				return f(d, acc);
			}), f(this.expression, acc));
		}
	}]);

	return LetExpression;
}(Expression);