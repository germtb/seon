
Error = (message) => { type: 'Error', message }

Success = value => { type: 'Success', value }

map = (f, errable) => match errable.type
  | 'Error' -> Error(errable.message)
  | 'Success' -> Success(f(errable.value))

andThen = (f, errable) => match errable.type
  | 'Error' -> Error(errable.message)
  | 'Success' -> f(errable.value)

module = {
  Error,
  Success,
  map,
  andThen
}
