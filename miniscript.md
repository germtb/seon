# Tokens
Node
	type: string

File < Node
	nodes: Array<Node>

Expression < Node

Statement < Node

Identifier < Node
	name: string

BooleanExpression < Expression
	value: boolean

NumberExpression < Expression
	value: number

StringExpression < Expression
	value: string

ArrayExpression < Expression
	value: Array<Expression>

FunctionExpression < Expression
	parameters: Array<string>
	body: BlockStatement | Expression

BlockStatement < Statement
	statements: Array<Statement>

Parameter < Node
	id: string
	value: Expression

CallExpression < Expression
	callee: Identifier
	parameters: Array<Parameter>

Declaration < Statement
	name: string
	value: Expression

BinaryExpression < Expression
	left: Expression
	right: Expression
	operator: BinaryOperator

BinaryOperator < Node

UnaryExpression < Expression
	expression: Expression
	operator: UnaryOperator

UnaryOperator < Node
	operator: UnaryOperatorType

PatternMatchingDefault < Node
	result: Expression

PatternMatchingCase < Node
	pattern: Expression
	result: Expression

PatternMatchingExpression < Node
	casePatterns: Array<PatternMatchingCase>
	defaultPattern: PatternMatchingDefault


ArrayAccessExpression < Expression
	object: Expression
	property: number

BlockStatement < Node
  body: [ Expression ]

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
  x = 0
  y = [0, 1, x]
  z = {
    x: x,
    y: y,
    u: 100
  }
ObjectAccess:
  z.x == 0
  z.y == [0, 1, 0]
ArrayAccess:
  y[0]

# Functions
FunctionExpression
f1 = x y => x + y
f1 = x y => {
  return x + y
}
CallExpression:
ParameterExpression:
f1(x: 10)(y: 10) == 100
f1(x: 10, y: 10) == 100
f1(y: 10, x: 10) == 100
f1(y: 10)(x: 10) == 100

# Pattern matching

cap = (x: string): string => x
  | [y, ...ys] -> y
  | [] -> 0

fib = n => n
	| 1 | 2 -> 1
	| n -> fib(n: n - 1) + fib(n: n - 2)

if = foo =>
  | true -> 0
  | false -> 1

y = x | [y, ...ys] => y | _ => 0

ternary = x => | true -> 1 | false -> 0

cap = x => 0 = 10 | 10 < x < 100 = x | 100
ternary = x => x == 10 = 10 | 100
x = y == 10 = 10 | 100

<!-- # Destructuring
tail = xs => [ x, ...rest ] = rest | []
find = xs => { x, ...rest } = x | false
map = f xs => [ x, ...rest ] = [ f(x)] -->

### Recursion
first = xs condition = [ x, ... xs ] = condition(x) =
