import { some, map } from './List'

test = (message, tests) =>
  match some(e => e.result == 'Failed', tests)
  | true -> let _ = log('Failed: ' + message) in { result: 'Failed' }
  | false -> let _ = log('Passed: ' + message) in { result: 'Pass' }

describe = test

equal = (received, expected) =>
  match (received == expected)
  | true -> { result: 'Pass' }
  | false -> { result: 'Failed' }

expect = (received) => {
  toEqual: equal(received),
  toBeTrue: () => equal(received, true),
  toBeFalse: () => equal(received, false)
}

module = {
  describe,
  test,
  expect
}
