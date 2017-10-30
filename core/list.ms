import { Nothing, Just } from './Maybe'

map = (f, list) => match list
  | [] -> []
  | [ x, ... xs ] -> [ f(x), ... map(f, xs) ]

reduce = (f, list, acc) => match list
  | [] -> acc
  | [ x, ... xs ] -> reduce(f, xs, f(acc, x))

some = (selector, list) => reduce(
  (acc, x) => acc || selector(x),
  list,
  false
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

head = list => match list
  | [] -> Nothing()
  | [x, ...xs] -> Just(x)

first = (selector, list) => match list
  | [] -> Nothing()
  | [x, ...xs] -> (match selector(x)
    | true -> Just(x)
    | false -> first(selector, xs)
  )

module = {
  some,
  map,
  reduce,
  take,
  head
}
