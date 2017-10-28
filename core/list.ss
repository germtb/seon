import { Nothing, Just } from './maybe'

map = (f, list) => match list
  | [] -> []
  | f [ x, ... xs ] -> [ f(x), ... xs |> map(f) ]

reduce = (f, list, acc) => match list
  | [] -> acc
  | [ x, ...xs ] -> xs |> reduce(f: f, acc: f(acc, x))

take = (n, list) => match [n, list]
  | [0, _]  -> []
  | [_, []] -> []
  | _ -> [x, ...take(n - 1, xs)]

head = list => match list
  | [] -> Nothing()
  | [x, ...xs] -> Just(x)

module = {
  map,
  reduce,
  take,
  head
}
