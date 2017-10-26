# Nodes
Node
	type: String

File < Node
	nodes: Array<Node>

Expression < Node

Statement < Node

IdentifierExpression < Node
	value: String

BooleanExpression < Expression
	value: Boolean

NumberExpression < Expression
	value: Number

StringExpression < Expression
	value: String

ArrayExpression < Expression
	value: Array<Expression>

ObjectExpression < Expression
	value: Array<ObjectProperty>

ObjectProperty < Node
	key: String
	value: Expression

BinaryExpression < Expression
	left: Expression
	right: Expression
	operator: BinaryOperator

BinaryOperator < Node
	operator: String

UnaryExpression < Expression
	argument: Expression
	operator: UnaryOperator

UnaryOperator < Node
	operator: String

Declaration < Statement
	pattern: Pattern
	value: Expression

FunctionExpression < Expression
	parameters: Array<Pattern>
	body: Expression | FunctionBody

FunctionBody < Node
	nodes: Array<Node>

ReturnStatement < Statement
	value: Expression

# Primitives
BooleanExpression: true, false
NumberExpression: 0, 1, 2...
ArrayExpression: []
ObjectExpression: {}
StringExpression: '1234'

# Type
type true == 'Boolean'
type 1 == 'Number'
type [] == 'Array'
type {} == 'Object'
type '' == 'String'

# Variables
Declaration:
let x = 0
let y = [0, 1, x]
let z = {
  x,
  y: y,
  u: 100
}

# Functions
let f = (x, y) => x + y
let f = x => x
let f = x => {
	let t = x * 2
	then t
}

# CallExpression:
f(x)
f(x)(y)
f(x, y)
f(x: 10)(y: 10)
f(x: 10, y: 10)
f(y: 10, x: 10)
f(y: 10)(x: 10)

# NamedParameterExpression
x
x: 100

# PatternMatchingExpression
x | 0 -> 0 | _ -> x * x

# Pattern matching

```
cap = x => x
	| [y, ...ys] -> y
	| [] -> 0

fib = n => n
	| 1 | 2 -> 1
	| _ -> fib(n: n - 1) + fib(n: n - 2)

map = (f, xs) => f, xs
	| _, [] -> []
	| f, [x, ...xs] -> [f(x), ...xs]

let x = foo | true -> 1 | false -> 0

find = (selector, xs) => case xs of
	| [] -> false
	| [x, ...xs] -> selector(x) | true -> true | false -> xs |> find(selector)

find = (selector, xs) => case xs of
	| [] -> false
	| [x, ...xs] -> case selector(x) of | true -> true | false -> xs |> find(selector)

```

# Monads
Nothing = () => { type: 'Nothing' }
Just = x -> { type: 'Just', value: x }

map = (f, maybe) => case maybe.type of
	| 'Nothing' -> Nothing()
	| 'Just' -> Just(f(x))

# TODO
- loc in tokens
- negative unary operator
- float numbers
- negative numbers
- auto caching
- function equality
- transpile to something (js)
- rewrite in itself
