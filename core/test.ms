import { some, all, map } from 'List'
import { log } from 'Debug'
import { stringify } from 'Core'

test = (message, tests) =>
  match some(e => e.result == 'Failed', tests)
  | true -> let _ = log('Failed: ' + message) in { result: 'Failed' }
  | false -> let _ = log('Passed: ' + message) in { result: 'Pass' }

describe = test

equal = (received, expected) =>
  match (received == expected)
  | true -> { result: 'Pass' }
  | false -> let
    _ = log('Expected: ', expected)
    _ = log('but received: ', received)
  in { result: 'Failed' }

deepEqual = (received, expected) => equal(stringify(received), stringify(expected))

expect = (received) => {
  toDeepEqual: deepEqual(received),
  toEqual: equal(received),
  toBeTrue: () => equal(received, true),
  toBeFalse: () => equal(received, false)
}

module = {
  describe,
  test,
  expect
}
