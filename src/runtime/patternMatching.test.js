import { match } from './patternMatching'
import { IdentifierExpression, RestElement, ObjectExpression } from './types'

describe('runtime', () => {
	let matchedScope

	beforeEach(() => {
		matchedScope = {}
	})

	describe('match', () => {
		describe('NoPattern', () => {
			test('Number', () => {
				expect(match(10, { type: 'NoPattern' })).toBeTruthy()
			})
			test('String', () => {
				expect(match('10', { type: 'NoPattern' })).toBeTruthy()
			})
			test('empty List', () => {
				expect(match([], { type: 'NoPattern' })).toBeTruthy()
			})
			test('empty Object', () => {
				expect(match({}, { type: 'NoPattern' })).toBeTruthy()
			})
			test('Boolean', () => {
				expect(match(true, { type: 'NoPattern' })).toBeTruthy()
			})
		})

		describe('Boolean', () => {
			test('Number', () => {
				expect(match(10, true)).toBeFalsy()
			})
			test('String', () => {
				expect(match('10', true)).toBeFalsy()
			})
			test('empty List', () => {
				expect(match([], true)).toBeFalsy()
			})
			test('empty Object', () => {
				expect(match({}, true)).toBeFalsy()
			})
			test('Boolean', () => {
				expect(match(true, true)).toBeTruthy()
			})
		})

		describe('number', () => {
			test('Number', () => {
				expect(match(10, 10)).toBeTruthy()
			})
			test('String', () => {
				expect(match('10', 10)).toBeFalsy()
			})
			test('empty List', () => {
				expect(match([], 10)).toBeFalsy()
			})
			test('empty Object', () => {
				expect(match({}, 10)).toBeFalsy()
			})
			test('Boolean', () => {
				expect(match(true, 10)).toBeFalsy()
			})
		})

		describe('string', () => {
			test('Number', () => {
				expect(match(10, '10')).toBeFalsy()
			})
			test('String', () => {
				expect(match('10', '10')).toBeTruthy()
			})
			test('empty List', () => {
				expect(match([], '10')).toBeFalsy()
			})
			test('empty Object', () => {
				expect(match({}, '10')).toBeFalsy()
			})
			test('Boolean', () => {
				expect(match(true, '10')).toBeFalsy()
			})
		})

		describe('identifier', () => {
			test('Number', () => {
				expect(match(10, IdentifierExpression('x'), matchedScope)).toBeTruthy()
				expect(matchedScope['x']).toEqual(10)
			})
			test('String', () => {
				expect(
					match('10', IdentifierExpression('x'), matchedScope)
				).toBeTruthy()
				expect(matchedScope['x']).toEqual('10')
			})
			test('empty List', () => {
				expect(match([], IdentifierExpression('x'), matchedScope)).toBeTruthy()
				expect(matchedScope['x']).toEqual([])
			})
			test('empty Object', () => {
				expect(match({}, IdentifierExpression('x'), matchedScope)).toBeTruthy()
				expect(matchedScope['x']).toEqual({})
			})
			test('Boolean', () => {
				expect(
					match(true, IdentifierExpression('x'), matchedScope)
				).toBeTruthy()
				expect(matchedScope['x']).toEqual(true)
			})
		})

		describe('empty arrays', () => {
			test('Number', () => {
				expect(match(10, [])).toBeFalsy()
			})
			test('String', () => {
				expect(match('10', [])).toBeFalsy()
			})
			test('1-List', () => {
				expect(match([1], [])).toBeFalsy()
			})
			test('empty List', () => {
				expect(match([], [])).toBeTruthy()
			})
			test('empty Object', () => {
				expect(match({}, [])).toBeFalsy()
			})
			test('Boolean', () => {
				expect(match(true, [])).toBeFalsy()
			})
		})

		describe('1-match-number arrays', () => {
			test('Number', () => {
				expect(match(10, [1])).toBeFalsy()
			})
			test('String', () => {
				expect(match('10', [1])).toBeFalsy()
			})
			test('1-List', () => {
				expect(match([1], [1])).toBeTruthy()
			})
			test('empty List', () => {
				expect(match([], [1])).toBeFalsy()
			})
			test('empty Object', () => {
				expect(match({}, [1])).toBeFalsy()
			})
			test('Boolean', () => {
				expect(match(true, [1])).toBeFalsy()
			})
		})

		describe('1-match-identifier arrays', () => {
			test('String', () => {
				expect(match('10', [IdentifierExpression('x')])).toBeFalsy()
			})
			test('1-List', () => {
				expect(
					match([1], [IdentifierExpression('x')], matchedScope)
				).toBeTruthy()
				expect(matchedScope['x']).toEqual(1)
			})
			test('empty List', () => {
				expect(match([], [IdentifierExpression('x')])).toBeFalsy()
			})
			test('empty Object', () => {
				expect(match({}, [IdentifierExpression('x')])).toBeFalsy()
			})
			test('Boolean', () => {
				expect(match(true, [IdentifierExpression('x')])).toBeFalsy()
			})
		})

		describe('n-match-identifier arrays', () => {
			test('String', () => {
				expect(
					match('10', [IdentifierExpression('x'), RestElement('xs')])
				).toBeFalsy()
			})
			test('1-List', () => {
				expect(
					match(
						[1],
						[IdentifierExpression('x'), RestElement('xs')],
						matchedScope
					)
				).toBeTruthy()
				expect(matchedScope['x']).toEqual(1)
				expect(matchedScope['xs']).toEqual([])
			})
			test('empty List', () => {
				expect(
					match([], [IdentifierExpression('x'), RestElement('xs')])
				).toBeFalsy()
			})
			test('empty Object', () => {
				expect(
					match({}, [IdentifierExpression('x'), RestElement('xs')])
				).toBeFalsy()
			})
			test('Boolean', () => {
				expect(
					match(true, [IdentifierExpression('x'), RestElement('xs')])
				).toBeFalsy()
			})
		})

		describe('empty objects', () => {
			test('Number', () => {
				expect(match(10, ObjectExpression([]))).toBeFalsy()
			})
			test('String', () => {
				expect(match('10', ObjectExpression([]))).toBeFalsy()
			})
			test('1-List', () => {
				expect(match([1], ObjectExpression([]))).toBeFalsy()
			})
			test('empty List', () => {
				expect(match([], ObjectExpression([]))).toBeFalsy()
			})
			test('empty Object', () => {
				expect(match({}, ObjectExpression([]))).toBeTruthy()
			})
			test('Boolean', () => {
				expect(match(true, ObjectExpression([]))).toBeFalsy()
			})
		})

		describe('1-Objects', () => {
			test('Number', () => {
				expect(
					match(
						10,
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})

			test('String', () => {
				expect(
					match(
						'10',
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})

			test('1-List', () => {
				expect(
					match(
						[1],
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})

			test('0-List', () => {
				expect(
					match(
						[],
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})

			test('0-Object', () => {
				expect(
					match(
						{},
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})

			test('1-Object', () => {
				expect(
					match(
						{ x: 10 },
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						]),
						matchedScope
					)
				).toBeTruthy()
				expect(matchedScope.x).toEqual(10)
			})

			// test('1-Object', () => {
			// 	expect(
			// 		match(
			// 			{ x: 10 },
			// 			ObjectExpression([
			// 				{
			// 					property: IdentifierExpression('x'),
			// 					config: { computed: true }
			// 				}
			// 			]),
			// 			matchedScope
			// 		)
			// 	).toBeTruthy()
			// expect(matchedScope.x).toEqual({ key: 'x', value: 10 })
			// })

			test('2-Object', () => {
				expect(
					match(
						{ x: 10, y: 20 },
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})

			test('Boolean', () => {
				expect(
					match(
						true,
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})
		})

		describe('n-Object', () => {
			test('2-Object', () => {
				expect(
					match(
						{ x: 10, y: 20 },
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							},
							{ property: RestElement('xs'), config: { computed: false } }
						]),
						matchedScope
					)
				).toBeTruthy()
				expect(matchedScope.x).toEqual(10)
				expect(matchedScope.xs).toEqual({ y: 20 })
			})

			test('1-Object', () => {
				expect(
					match(
						{ x: 10 },
						ObjectExpression([
							{
								property: IdentifierExpression('x'),
								config: { computed: false }
							},
							{
								property: IdentifierExpression('y'),
								config: { computed: false }
							}
						])
					)
				).toBeFalsy()
			})
		})
	})
})
