import { Nothing, Just } from './Maybe'

keys = dict => match dict
  | {} -> []
  | { [x], ...xs } -> [x, ...keys(xs)]

values = dict => match dict
  | {} -> []
  | { [x], ...xs } -> [dict[x], ...values(xs)]

entries = dict => match dict
  | {} -> []
  | { [x], ...xs } -> [[ x, dict[x] ], ...entries(xs)]

keyMap = dict => match dict

module = {
  keys,
  values,
  entries
}
