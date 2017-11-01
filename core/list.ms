import { Nothing, Just } from 'Maybe'

map = (f, list) => match list
  | [] -> []
  | [ x, ... xs ] -> [ f(x), ... map(f, xs) ]

andThen = (f, list) => match list
  | [] -> []
  | [x, ...xs] -> [...f(x), ...andThen(f, xs)]

reduce = (f, list, acc) => match list
  | [] -> acc
  | [ x, ... xs ] -> reduce(f, xs, f(acc, x))

some = (selector, list) => reduce(
  (acc, x) => acc || selector(x),
  list,
  false
)

head = list => match list
  | [] -> Nothing()
  | [x, ...xs] -> Just(x)

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
  | [0, list]  -> []
  | [n, []] -> []
  | _ -> [x, ...take(n - 1, xs)]

first = (selector, list) => match list
  | [] -> Nothing()
  | [x, ...xs] -> (match selector(x)
    | true -> Just(x)
    | false -> first(selector, xs)
  )

module = {
  map,
  andThen,
  reduce,
  some,
  head,
  filter,
  all,
  take,
  first
}
