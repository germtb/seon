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

map = (f, list) => match list
  | [] -> []
  | [x, ...xs] -> f(x)::map(f, xs)

keys = obj => match obj
  | {} -> []
  | { x?, ...xs } -> let { key } = x in key::keys(xs)

values = obj => match obj
  | {} -> []
  | { x?, ...xs } -> let { value } = x in value::values(xs)

head = (list) => match list
  | [] -> Nothing()
  | [x, ...xs] -> Just(x)

tail = (list) => xs

sum = (list, acc: 0) => match list
  | [] -> acc
  | [x, ...xs] -> sum(xs, acc + x)
