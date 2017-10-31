
Left = value => { type: 'Left', value }

Right = value => { type: 'Right', value }

map = (f, either) => match either.type
  | 'Left' -> Left(f(either.value))
  | 'Right' -> Right(f(either.value))

andThen = (f, either) => match either.type
  | 'Left' -> f(either.value)
  | 'Right' -> f(either.value)

module = {
  Left,
  Right,
  map,
  andThen
}
