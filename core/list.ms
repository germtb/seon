import { Nothing, Just } from './maybe'

map = (f, list) => match list
  | [] -> []
  | [ x, ... xs ] -> [ f(x), ... map(f, xs) ]

reduce = (f, list, acc) => match list
  | [] -> acc
  | [ x, ... xs ] -> reduce(f, xs, f(acc, x))

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

log(first(list: [ 1 ], selector: x => true))

module = {
  map,
  reduce,
  take,
  head
}
