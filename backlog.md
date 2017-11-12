# TODO
- transpile to something
- rewrite in itself
- Implement core libraries
- Create syntax theme
- Better parsing errors

# MAYBE DO
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
  | [x, ...xs] -> f(x :: map(f, xs)

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
  | [n, [x, ...xs]] -> x :: take(n - 1, xs)

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
  | true  -> start :: range(start + 1, end)

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
  | [x, ...xs] -> queue(reverse(x), x)

intersperse = (element, list) => match list
  | [] -> []
  | [x] -> [x]
  | [x, y, ...xs] -> x :: element :: interspere(element, y :: xs)

sum = (initialValue, list) => reduce(
  (acc, x) => acc + x,
  list,
  initialValue
)

join = (element, list) => intersperse(element, list)
  |> map(stringify)
  |> sum('')

keys = object => match object
  | {} -> []
  | { #x, ...xs } -> [ x.key, ...keys(xs) ]

values = object => match object
  | {} -> []
  | { #x, ...xs } -> [ x.value, ...values(xs) ]

entries = object => match object
  | {} -> []
  | { #x, ...xs } -> [ x, ...entries(xs) ]

insert = (key, value, object) => {
  ...object,
  #key: value
}

filter = (selector, object) => match object
  | {} -> {}
  | { #x, ...xs } -> (match selector(x.key, x.value)
    | true -> { #x.key: x.value, ...filter(selector, xs) }
    | false -> filter(selector, xs)
  )

counter = (state, action) = match [ state, action.type  ]
  | [ { type: 'Nothing' }, _  ] -> 0
  | [ _, 'INCREASE' ] -> state + 1
  | [ _, 'DECREASE' ] -> state - 1
  | _ -> state

message = (state, action) = match [ state, action.type ]
  | [ { type: 'Nothing' }, _ ] -> ''
  | [ _, 'SET' ] -> action.payload
  | _ -> state

combineReducers = (reducers, state, action) =>
  reducers |> reduce((acc, entry) =>
    let key, value } = entry
    in {
      ...state,
      #key: value(state?#key, action)
    }, state)

reducers = combineReducers({ counter, message })
