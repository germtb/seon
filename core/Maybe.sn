
Nothing = () => { type: 'Nothing' }

Just = value => { type: 'Just', value }

map = (f, maybe) => match maybe.type
  | 'Nothing' -> Nothing()
  | 'Just' -> Just(f(maybe.value))

andThen = (f, maybe) => match maybe.type
  | 'Nothing' -> Nothing()
  | 'Just' -> f(maybe.value)

module = {
  Nothing,
  Just,
  map,
  andThen
}
