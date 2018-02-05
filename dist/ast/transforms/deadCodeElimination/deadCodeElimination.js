'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var visitorsFactory = function visitorsFactory(_ref) {
	var traverse = _ref.traverse,
	    growScope = _ref.growScope,
	    add = _ref.add,
	    mark = _ref.mark;
	return {
		File: function File(node, scopes) {
			node.nodes.forEach(function (node) {
				traverse(node, scopes);
			});
		},
		ImportDeclaration: function ImportDeclaration(node, scopes) {
			add(node.declarator, scopes);
		},
		IdentifierExpression: function IdentifierExpression(node, scopes) {
			mark(node.name, scopes);
		},
		ArrayExpression: function ArrayExpression(node, scopes) {
			node.values.forEach(function (node) {
				if (node.type === 'RestElement') {
					traverse(node.value, scopes);
				} else {
					traverse(node, scopes);
				}
			});
		},
		ObjectExpression: function ObjectExpression(node, scopes) {
			node.properties.forEach(function (node) {
				traverse(node, scopes);
			});
		},
		ObjectProperty: function ObjectProperty(node, scopes) {
			var property = node.property;

			if (property.type === 'NamedParameter') {
				traverse(property.value, scopes);
			} else if (property.type === 'IdentifierExpression') {
				mark(property.name, scopes);
			} else if (property.type === 'RestElement') {
				traverse(property.value, scopes);
			}
		},
		ObjectAccessExpression: function ObjectAccessExpression(node, scopes) {
			// TODO: if computed, traverse, otherwise do not
			traverse(node.expression, scopes);
		},
		BinaryExpression: function BinaryExpression(node, scopes) {
			traverse(node.left, scopes);
			traverse(node.right, scopes);
		},
		UnaryExpression: function UnaryExpression(node, scopes) {
			traverse(node.expression, scopes);
		},
		FunctionExpression: function FunctionExpression(node, scopes) {
			var functionScope = growScope(scopes);
			traverse(node.parameters, functionScope);
			traverse(node.body, functionScope);
		},
		CallExpression: function CallExpression(node, scopes) {
			traverse(node.callee, scopes);
			node.parameters.forEach(function (node) {
				return traverse(node, scopes);
			});
		},
		NamedParameter: function NamedParameter(node, scopes) {
			traverse(node.value, scopes);
		},
		LetExpression: function LetExpression(node, scopes) {
			var letScope = growScope(scopes);
			node.declarations.forEach(function (d) {
				traverse(d, letScope);
			});
			traverse(node.expression, letScope);
		},
		PatternExpression: function PatternExpression(node, scopes) {
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = node.patternCases.length[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pattern = _step.value;

					var matchedScope = growScope(scopes);

					traverse(pattern.pattern);

					add(pattern.pattern, matchedScope);
					traverse(pattern.result, matchedScope);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		},
		Declaration: function Declaration(node, scopes) {
			var declarator = node.declarator,
			    value = node.value;

			add(declarator, scopes);
			traverse(value, scopes);
		}
	};
};

exports.default = function () {
	var scopesCash = new Set();
	var initialScope = {};
	scopesCash.add(initialScope);

	var traverse = function traverse(node) {
		var scopes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [initialScope];

		var type = node.type;
		var visitor = visitors[type];

		if (!visitor) {
			console.log('Not visiting ' + type);
		}

		visitor(node, scopes);
	};

	function growScope() {
		var newScope = {};
		scopesCash.add(newScope);
		return scopesCash;
		// return [...scopes, newScope]
	}

	function addName(name, scopes) {
		scopes[scopes.length - 1][name] = 'Unused';
	}

	var mark = function mark(name, scopes) {
		for (var i = scopes.length - 1; i >= 0; i--) {
			if (scopes[i][name]) {
				scopes[i][name] = 'Used';
			}
		}
	};

	function add(node, scopes) {
		if (node.type === 'IdentifierExpression') {
			addName(node.name, scopes);
		} else if (node.type === 'ObjectExpression') {
			node.properties.forEach(function (node) {
				if (node.type === 'IdentifierExpression') {
					addName(node.name, scopes);
				} else {
					console.log('TODO: ObjectExpxpression');
				}
			});
		} else if (node.type === 'ArrayExpression') {
			node.properties.forEach(function (node) {
				if (node.type === 'IdentifierExpression') {
					addName(node.name, scopes);
				} else {
					console.log('TODO: ArrayExpression');
				}
			});
		}
	}

	var visitors = visitorsFactory({
		traverse: traverse,
		growScope: growScope,
		add: add,
		mark: mark
	});

	return scopesCash;
};