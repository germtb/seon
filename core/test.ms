import { some } from './list'

// describe = (message, tests) => match some(e => e.result == 'Failed', expectations)
//   | true -> { result: 'Pass' }
//   | false -> { result: 'Failed' }

test = (message, expectations) =>
  match some(e => e.result == 'Failed', expectations)
  | true -> { result: 'Pass' }
  | false -> let _ = log('Failed') in { result: 'Failed' }

expect = (expression) => {
  toEqual: (expected) => match (expression == expected)
    | true -> { result: 'Pass' }
    | false -> { result: 'Failed' }
}

test([
  expect(1).toEqual(0)
])

// module = {
//   describe,
//   test,
//   expect
// }
