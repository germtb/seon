# TODO
- make differnt parts of the bundle not collide
- underscore bug when used in as a function parameter
- interop with javascript
- rewrite in itself
- Implement core libraries
- Better parsing errors
- Create syntax theme

# MAYBE DO
- hoisting?
- Build imports into the AST?
- pattern match with 1 | 2 | 3 ...
- Default function parameters
- Computed props
- Create bindings for node libraries
- eval as part of the core libraries
- extensible parser
- auto caching
- function equality

concat = (list1, list2) => match list1
	| [] -> list2
	| [x, ...xs] -> [x, ...concat(xs, list2)]

map = (f, list) => match list
	| [] -> []
	| [x, ...xs] -> [f(x), ...map(f, xs)]

map2 = (f, list1, list2) => match [list1, list2]
	| [_, []] -> []
	| [[], _] -> []
	| [[x, ...xs], [y, ...ys]] -> [f(x, y), ...map2(f, list1, list2)]

flatMap = (f, list) => match list
	| [] -> []
	| [x, ...xs] -> concat(f(x), flatMap(f, xs))

reduce = (f, list, acc) => match list
	| [] -> acc
	| [x, ...xs] -> reduce(f, xs, f(acc, x))

some = (selector, list) => reduce(
	(acc, x) => acc || selector(x),
	list,
	false
)

head = list => match list
	| [] -> Nothing()
	| [x, ...xs] -> Just(x)

tail = list => match list
	| [] -> Nothing()
	| [x, ...xs] -> Just(xs)

filter = (selector, list) => match list
	| [] -> []
	| [x, ...xs] -> (match selector(x)
		| true -> [x, ...filter(selector, xs)]
		| false -> filter(selector, xs)
	)

all = (selector, list) => reduce(
	(acc, x) => acc && selector(x),
	list,
	true
)

take = (n, list) => match [n, list]
	| [0, _]  -> []
	| [_, []] -> []
	| [n, [x, ...xs]] -> [ x, ...take(n - 1, xs) ]

drop = (n, list) => match [n, list]
	| [0, _] -> list
	| [_, []] -> []
	| [n, [x, ...xs]] -> drop(n - 1, xs)

first = (selector, list) => match list
	| [] -> Nothing()
	| [x, ...xs] -> (match selector(x)
		| true -> Just(x)
		| false -> first(selector, xs)
	)

range = (start, end) => match (end - start) > 0
	| false -> []
	| true  -> [ start, ...range(start + 1, end) ]

length = list => reduce((acc, _) => acc + 1, list, 0)

zip = (list1, list2) => match [list1, list2]
	| [_, []] -> []
	| [[], _] -> []
	| [[x, ...xs], [y, ...ys]] -> [[x, y], ...zip(xs, ys)]

queue = (element, list) => match List
	| [] -> [element]
	| [x, ...xs] -> [x, ...queue(element, xs)]

reverse = list => match list
	| [] -> []
	| [x, ...xs] -> queue(reverse(xs), x)

intersperse = (element, list) => match list
	| [] -> []
	| [x] -> [x]
	| [x, y, ...xs] -> [
		x,
		element,
		interspere(element, [ y, ...xs ])
	]

sum = (initialValue, list) => reduce(
	(acc, x) => acc + x,
	list,
	initialValue
)

join = (element, list) => intersperse(element, list)
	|> map(stringify)
	|> sum('')

keys = object => internalKeys(object)

values = object => object
	|> keys
	|> map(get(object: object))

entries = object => object
	|> keys
	|> map(k => [k, get(k, object)])

counter = (state, action) = match action.type
	| 'INCREASE' -> state + 1
	| 'DECREASE' -> state - 1
	| _ -> state

message = (state, action) = match action.type
	| 'SET' -> action.payload
	| _ -> state

combineReducers = (reducers, state, action) =>
	reducers |> keys |> reduce((acc, key) =>
		let value = reducers#key
		in {
			...state,
			#key: value(state#key, action)
		}, state)

reducers = combineReducers({ counter, message })

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

todos = (state, action: { type, text }) => match action.type
	| 'ADD_TODO' -> [ ...state, { text, done: false } ]
	| 'TOGGLE_TODO' -> state |> map(todo => match todo.text == text
		| true -> { ...todo, done: not todo.done }
		| false -> todo
	)
	| _ -> state

input = (state, action: { type, value }) => match action.type
	| 'ADD_TODO' -> ''
	| 'SET_INPUT' -> value
	| _ -> state

reducers = combineReducers({ todos })

getTodos = state => state.todos

getInput = state => state.todos

store = createStore(reducers)

render(
	<Provider store>
		<App />
	</Provider>,
	document.getElementById('root')
)

toggleTodo = id => { type: 'TOGGLE_TODO', id }
addTodo = text => { type: 'ADD_TODO', text }
setInput = text => { type: 'SET_INPUT', text }

UnconnectedTodos = (props: { todos, toggleTodo }) =>
	todos |> map(todo =>
		<span key={ todo.text |> withDefault('') }>
			{ todo.text }
			<button onClick={ () => toggleTodo(todo.text) }>
				Toggle
			</button>
		</span>
	)

Todos = UnconnectedTodos |> connect({
	state: state => {
		todos: getTodos(state)
	},
	dispatch: dispatch => {
		toggleTodo: id => dispatch(toggleTodo(id)),
	}
})

UnconnectedForm = (props: {
	addTodo,
	input,
	setInput
}) =>
	<form onSubmit={ e => let _ = e.preventDefault() in addTodo(input.value) }>
		<input value={ input } onChange={e => setInput(e.target.value) } />
		<button type="submit"> Add Todo </button>
	</form>

[ 8, 10 , 9 ]
	|> sort((x, y) => x > y) // [10, 9, 8]
	|> head // { type: 'Just', value: 100 }
	|> Maybe.map(x => 10 * x) // { type: 'Just', value: 100 }
	|> withDefault('Did not work') // 100

[]
	|> sort((x, y) => x > y) // []
	|> head // { type: 'Nothing' }
	|> Maybe.map(x => 10 * x) // { type: 'Nothing' }
	|> withDefault('Did not work') // 'Did not work'

Form = UnconnectedForm |> connect({
	state: state => {
		input: getInput(state)
	},
	dispatch: dispatch => {
		toggleTodo: id => dispatch(toggleTodo(id)),
		addTodo: text => dispatch(addTodo(text)),
		setInput: text => dispatch(setInput(text))
	}
})

App = () => <ul>
	<Todos />
	<Form />
</ul>
