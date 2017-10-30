import { some } from './list'

describe = (message, tests) => match some(e => e.result === 'Failed', expectations)
  | true -> { result: 'Pass' }
  | false -> { result: 'Failed' }

test = (message, expectations) => match some(e => e.result === 'Failed', expectations)
  | true -> { result: 'Pass' }
  | false -> { result: 'Failed' }

expect = (expression) => {
  toEqual: (expected) => match (expression === expected)
    | true -> { result: 'Pass' }
    | false -> { result: 'Failed' }
}

module = {
  describe,
  test,
  expect
}
