# <img src="https://github.com/germtb/seon/blob/master/icon.png?raw=true" width="48">

Seon is a minimal function programming language that targets javascript.

```
// Comments with //

// null/undefined do not exist

// Arithmetic
1 + 2 - 3
3 * 5

// Exponents
3 ** 2

// Booleans
true
false

// Strings
'this is a string'
'they
can
be
multiline
'
'and' + 'they' + 'can' + 'sum'

// All data structures are immutable

// Arrays
x = [0, 1, 2]
['a', 'b', 'c', ...x]

// Objects
foo = { x: 10 }
bar = { y: 10, ...foo }

// Object access
foo.x // 10
foo.y // throws runtime exception
foo?x |> map(?y) // Just(10)
foo?y // Nothing()

// Functions
x => x
(x, y) => x + 2 * y

// let...in
let x = 10 in x // 10

f = x => let
  y = x * x
  z = x * y
  in x + y + z

// Function calls
f = (x, y) => x + 2 * y
f(1, 10) // 21
f(y: 10, x: 1) // 21 named paramaters
f(1)(10) // 21 auto-curried
f(y: 10)(1) // 21

// Pipe
f = x => 2 * x

2 |> f |> f |> f // 16

// Declarations
x = [0, 1, 2]
[y, ...ys] = x // y == 0, ys == [1, 2]

x = { y: 10, z: 10 }
{ y, ...ys } = x // y == 10, ys == { z: 10 }

// Pattern matching
match x
  | 0 -> 10 * x // Numbers
  | 'some text' -> 'the cake is a lie' // Strings
  | false -> 0 // Booleans
  | y::[] -> y // 1-element Array
  | y::z::[] -> y // 2-element Array
  | y::ys -> ys // n-element Array
  | { *y } -> [ y.key, y.value ] // Matches any object with one key value and assign those to an object named y of the shape { key: 'foo', value: 'bar' }
  | { y } -> y // Object with one key named 'y'
  | { y, z } -> [ y, z ] // Object with two keys named 'y' and 'z'
  | { y, ...ys } -> ys // Object with one key named 'y' and any other number of keys
  | _ -> 'Anything works' // No pattern at all. It always matches

// Modules
module = { x: 10 } // Declares a 'module' variable in file foo.sn

import foo from './foo' // sets the variable foo to { x: 10 }
import { x } from './foo' // destructures the module object

module = 10 // valid
module = true // valid
module = [10, 12, 14] // valid

import [ x, y, z ] from './bar' // any pattern would work

import List from 'List' // absolute imports refer to core modules
import { map } from 'List' // which of course can also be destructured

// Examples

// Reducer
counter = (state, action as { type, payload }) => match type
  | type 'INCREASE' -> state + payload
  | type 'DECREASE' -> state - payload
  | _ -> state

createActionCreator = (type, payload) => { type, payload }
increase = createActionCreator('INCREASE')
decrease = createActionCreator('DECREASE')

store = (state: {}, reducers)

```
