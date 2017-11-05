import { match } from './patternMatching'

const typeFactory = type => value => ({
	type,
	value
})

const NoPattern = typeFactory('NoPattern')
const BooleanExpression = typeFactory('BooleanExpression')
const NumberExpression = typeFactory('NumberExpression')
const StringExpression = typeFactory('StringExpression')
const IdentifierExpression = name => ({
	type: 'IdentifierExpression',
	name
})
const ArrayExpression = values => ({
	type: 'ArrayExpression',
	values
})
const RestElement = name => ({
	type: 'RestElement',
	value: {
		name
	}
})
const ObjectExpression = properties => ({
	type: 'ObjectExpression',
	properties
})

describe('runtime', () => {
	describe('match', () => {
		test('no pattern', () => {
			expect(match(10, NoPattern())).toBeTruthy()
			expect(match('10', NoPattern())).toBeTruthy()
			expect(match([], NoPattern())).toBeTruthy()
			expect(match({}, NoPattern())).toBeTruthy()
			expect(match(true, NoPattern())).toBeTruthy()
		})

		test('boolean', () => {
			expect(match(10, BooleanExpression(true))).toBeFalsy()
			expect(match('10', BooleanExpression(true))).toBeFalsy()
			expect(match([], BooleanExpression(true))).toBeFalsy()
			expect(match({}, BooleanExpression(true))).toBeFalsy()
			expect(match(true, BooleanExpression(true))).toBeTruthy()
		})

		test('number', () => {
			expect(match(10, NumberExpression(10))).toBeTruthy()
			expect(match('10', NumberExpression(10))).toBeFalsy()
			expect(match([], NumberExpression(10))).toBeFalsy()
			expect(match({}, NumberExpression(10))).toBeFalsy()
			expect(match(true, NumberExpression(10))).toBeFalsy()
		})

		test('string', () => {
			expect(match(10, StringExpression('10'))).toBeFalsy()
			expect(match('10', StringExpression('10'))).toBeTruthy()
			expect(match([], StringExpression('10'))).toBeFalsy()
			expect(match({}, StringExpression('10'))).toBeFalsy()
			expect(match(true, StringExpression('10'))).toBeFalsy()
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
			expect(match(10, ArrayExpression([]))).toBeFalsy()
			expect(match('10', ArrayExpression([]))).toBeFalsy()
			expect(match([1], ArrayExpression([]))).toBeFalsy()
			expect(match([], ArrayExpression([]))).toBeTruthy()
			expect(match({}, ArrayExpression([]))).toBeFalsy()
			expect(match(true, ArrayExpression([]))).toBeFalsy()
		})

		test('1-match-number arrays', () => {
			expect(match('10', ArrayExpression([NumberExpression(1)]))).toBeFalsy()
			expect(match([1], ArrayExpression([NumberExpression(1)]))).toBeTruthy()
			expect(match([], ArrayExpression([NumberExpression(1)]))).toBeFalsy()
			expect(match({}, ArrayExpression([NumberExpression(1)]))).toBeFalsy()
			expect(match(true, ArrayExpression([NumberExpression(1)]))).toBeFalsy()
		})

		test('1-match-identifier arrays', () => {
			const matchedScope = {}
			expect(
				match('10', ArrayExpression([IdentifierExpression('x')]))
			).toBeFalsy()
			expect(
				match([1], ArrayExpression([IdentifierExpression('x')]), matchedScope)
			).toBeTruthy()
			expect(matchedScope['x']).toEqual(1)
			expect(
				match([], ArrayExpression([IdentifierExpression('x')]))
			).toBeFalsy()
			expect(
				match({}, ArrayExpression([IdentifierExpression('x')]))
			).toBeFalsy()
			expect(
				match(true, ArrayExpression([IdentifierExpression('x')]))
			).toBeFalsy()
		})

		test('n-match-identifier arrays', () => {
			const matchedScope = {}
			expect(
				match(
					'10',
					ArrayExpression([IdentifierExpression('x'), RestElement('xs')])
				)
			).toBeFalsy()
			expect(
				match(
					[1],
					ArrayExpression([IdentifierExpression('x'), RestElement('xs')]),
					matchedScope
				)
			).toBeTruthy()
			expect(matchedScope['x']).toEqual(1)
			expect(matchedScope['xs']).toEqual([])
			expect(
				match(
					[],
					ArrayExpression([IdentifierExpression('x'), RestElement('xs')])
				)
			).toBeFalsy()
			expect(
				match(
					{},
					ArrayExpression([IdentifierExpression('x'), RestElement('xs')])
				)
			).toBeFalsy()
			expect(
				match(
					true,
					ArrayExpression([IdentifierExpression('x'), RestElement('xs')])
				)
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
