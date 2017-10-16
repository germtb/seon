# Tokens

Node
  type: string

Identifier < Node
  name: string

Expression < Node

BooleanExpression < Expression
  value: true | false

NumberExpression < Expression
  value: number

EmptyArrayExpression < Expression

ArrayExpression < Expression
  value: [ Expression ]

StringExpression < Expression
  value: string

FunctionExpression < Expression
  parameters: [ string ]
  body: Expression | BlockStatement

BlockStatement < Node
  body: [ Expression ]

Parameter < Node
  id: string
  value: Expression

CallExpression < Expression
  callee: Identifier
  parameters: [ Parameter ]

Declaration < Statement
  name: string
  value: Expression

BinaryExpression < Expression
  left: Expression
  right: Expression
  operator: BinaryOperator

BinaryOperator < Node
  operator: + | - | * | / | ** | % | && | || | type | == | != | < | <= | > | >=

UnaryExpression < Expression
  argument: Expression
  operator: UnaryOperator

UnaryOperator < Node
  operator: - | !

PatternMatchingExpression < Expression
  patterns: [ PatternMatchingCase | PatternMatchingDefault ]

PatternMatchingCase < Node
  case: Expression
  result: Expression

PatternMatchingDefault < Expression
  result: Expression

ArrayAccessExpression < Expression
  object: Expression
  property: Expression

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

cap = x =>
  0 = 10 |
  10 < x < 100 = x |
  100
cap = x => 0 = 10 | 10 < x < 100 = x | 100
ternary = x => x == 10 = 10 | 100
x = y == 10 = 10 | 100

<!-- # Destructuring
tail = xs => [ x, ...rest ] = rest | []
find = xs => { x, ...rest } = x | false
map = f xs => [ x, ...rest ] = [ f(x)] -->

### Recursion
first = xs condition = [ x, ... xs ] = condition(x) =
