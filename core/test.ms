import { some } from './List'

describe = (message, tests) =>
  match some(e => e.result == 'Failed', tests)
  | true -> let _ = log('Describe failed') in { result: 'Failed' }
  | false -> let _ = log('Describe passed') in { result: 'Pass' }

test = (message, expectations) =>
  match some(e => e.result == 'Failed', expectations)
  | true -> let _ = log('Failed: ' + message) in { result: 'Failed' }
  | false -> let _ = log('Passed') in { result: 'Pass' }

expect = (expression) => {
  toEqual: (expected) => match (expression == expected)
    | true -> { result: 'Pass' }
    | false -> { result: 'Failed' }
}

describe('describe', [
  test('test', [
    expect(0).toEqual(0)
  ])
])

module = {
  describe,
  test,
  expect
}
