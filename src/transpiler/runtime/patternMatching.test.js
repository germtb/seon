import { match } from './patternMatching'
import { IdentifierExpression, RestElement, ObjectExpression } from './types'

describe('runtime', () => {
	describe('match', () => {
		test('no pattern', () => {
			expect(match(10, { type: 'NoPattern' })).toBeTruthy()
			expect(match('10', { type: 'NoPattern' })).toBeTruthy()
			expect(match([], { type: 'NoPattern' })).toBeTruthy()
			expect(match({}, { type: 'NoPattern' })).toBeTruthy()
			expect(match(true, { type: 'NoPattern' })).toBeTruthy()
		})

		test('boolean', () => {
			expect(match(10, true)).toBeFalsy()
			expect(match('10', true)).toBeFalsy()
			expect(match([], true)).toBeFalsy()
			expect(match({}, true)).toBeFalsy()
			expect(match(true, true)).toBeTruthy()
		})

		test('number', () => {
			expect(match(10, 10)).toBeTruthy()
			expect(match('10', 10)).toBeFalsy()
			expect(match([], 10)).toBeFalsy()
			expect(match({}, 10)).toBeFalsy()
			expect(match(true, 10)).toBeFalsy()
		})

		test('string', () => {
			expect(match(10, '10')).toBeFalsy()
			expect(match('10', '10')).toBeTruthy()
			expect(match([], '10')).toBeFalsy()
			expect(match({}, '10')).toBeFalsy()
			expect(match(true, '10')).toBeFalsy()
		})

		test('identifier', () => {
			const matchedScope = {}
			expect(match(10, IdentifierExpression('x'), matchedScope)).toBeTruthy()
			expect(matchedScope['x']).toEqual(10)
			expect(match('10', IdentifierExpression('x'), matchedScope)).toBeTruthy()
			expect(matchedScope['x']).toEqual('10')
			expect(match([], IdentifierExpression('x'), matchedScope)).toBeTruthy()
			expect(matchedScope['x']).toEqual([])
			expect(match({}, IdentifierExpression('x'), matchedScope)).toBeTruthy()
			expect(matchedScope['x']).toEqual({})
			expect(match(true, IdentifierExpression('x'), matchedScope)).toBeTruthy()
			expect(matchedScope['x']).toEqual(true)
		})

		test('empty arrays', () => {
			expect(match(10, [])).toBeFalsy()
			expect(match('10', [])).toBeFalsy()
			expect(match([1], [])).toBeFalsy()
			expect(match([], [])).toBeTruthy()
			expect(match({}, [])).toBeFalsy()
			expect(match(true, [])).toBeFalsy()
		})

		test('1-match-number arrays', () => {
			expect(match('10', [1])).toBeFalsy()
			expect(match([1], [1])).toBeTruthy()
			expect(match([], [1])).toBeFalsy()
			expect(match({}, [1])).toBeFalsy()
			expect(match(true, [1])).toBeFalsy()
		})

		test('1-match-identifier arrays', () => {
			const matchedScope = {}
			expect(match('10', [IdentifierExpression('x')])).toBeFalsy()
			expect(match([1], [IdentifierExpression('x')], matchedScope)).toBeTruthy()
			expect(matchedScope['x']).toEqual(1)
			expect(match([], [IdentifierExpression('x')])).toBeFalsy()
			expect(match({}, [IdentifierExpression('x')])).toBeFalsy()
			expect(match(true, [IdentifierExpression('x')])).toBeFalsy()
		})

		test('n-match-identifier arrays', () => {
			const matchedScope = {}
			expect(
				match('10', [IdentifierExpression('x'), RestElement('xs')])
			).toBeFalsy()
			expect(
				match([1], [IdentifierExpression('x'), RestElement('xs')], matchedScope)
			).toBeTruthy()
			expect(matchedScope['x']).toEqual(1)
			expect(matchedScope['xs']).toEqual([])
			expect(
				match([], [IdentifierExpression('x'), RestElement('xs')])
			).toBeFalsy()
			expect(
				match({}, [IdentifierExpression('x'), RestElement('xs')])
			).toBeFalsy()
			expect(
				match(true, [IdentifierExpression('x'), RestElement('xs')])
			).toBeFalsy()
		})

		test('empty objects', () => {
			expect(match(10, ObjectExpression([]))).toBeFalsy()
			expect(match('10', ObjectExpression([]))).toBeFalsy()
			expect(match([1], ObjectExpression([]))).toBeFalsy()
			expect(match([], ObjectExpression([]))).toBeFalsy()
			expect(match({}, ObjectExpression([]))).toBeTruthy()
			expect(match(true, ObjectExpression([]))).toBeFalsy()
		})

		test('1-property objects', () => {
			const matchedScope = {}
			expect(
				match(10, ObjectExpression([{ property: IdentifierExpression('x') }]))
			).toBeFalsy()
			expect(
				match('10', ObjectExpression([{ property: IdentifierExpression('x') }]))
			).toBeFalsy()
			expect(
				match([1], ObjectExpression([{ property: IdentifierExpression('x') }]))
			).toBeFalsy()
			expect(
				match([], ObjectExpression([{ property: IdentifierExpression('x') }]))
			).toBeFalsy()
			expect(
				match({}, ObjectExpression([{ property: IdentifierExpression('x') }]))
			).toBeFalsy()
			expect(
				match(
					{ x: 10 },
					ObjectExpression([{ property: IdentifierExpression('x') }]),
					matchedScope
				)
			).toBeTruthy()
			expect(matchedScope.x).toEqual(10)
			expect(
				match(
					{ x: 10, y: 20 },
					ObjectExpression([{ property: IdentifierExpression('x') }])
				)
			).toBeFalsy()
			expect(
				match(
					{ x: 10 },
					ObjectExpression([
						{ property: IdentifierExpression('x') },
						{ property: IdentifierExpression('y') }
					])
				)
			).toBeFalsy()

			expect(
				match(true, ObjectExpression([{ property: IdentifierExpression('x') }]))
			).toBeFalsy()
		})

		test('n-properties objects', () => {
			const matchedScope = {}
			expect(
				match(
					{ x: 10, y: 20 },
					ObjectExpression([
						{ property: new IdentifierExpression('x') },
						{ property: new RestElement('xs') }
					]),
					matchedScope
				)
			).toBeTruthy()
			expect(matchedScope.x).toEqual(10)
			expect(matchedScope.xs).toEqual({ y: 20 })
		})
	})
})
