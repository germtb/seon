import tokenizer from '../tokenizer'
import parse from './index'
import {
	File,
	UnaryOperator,
	UnaryExpression,
	BinaryOperator,
	BinaryExpression,
	IdentifierExpression,
	BooleanExpression,
	NumberExpression,
	StringExpression,
	ArrayExpression,
	RestElement,
	ObjectExpression,
	ObjectProperty,
	NamedParameter,
	FunctionExpression,
	CallExpression,
	NoPattern,
	PatternCase,
	PatternExpression,
	Declaration,
	LetExpression
} from './nodes'

describe('parser specs', () => {
	test('fibonacci', () => {
		const tokens = tokenizer(`
			fib = n => n
				| 1 -> 1
				| 2 -> 1
				| _ -> fib(n - 1) + fib(n - 2)
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					new IdentifierExpression('fib'),
					new FunctionExpression(
						[new IdentifierExpression('n')],
						new PatternExpression(
							[new IdentifierExpression('n')],
							[
								new PatternCase(
									[new NumberExpression(1)],
									new NumberExpression(1)
								),
								new PatternCase(
									[new NumberExpression(2)],
									new NumberExpression(1)
								),
								new PatternCase(
									[new NoPattern()],
									new BinaryExpression(
										new CallExpression(new IdentifierExpression('fib'), [
											new BinaryExpression(
												new IdentifierExpression('n'),
												new BinaryOperator('-'),
												new NumberExpression(1)
											)
										]),
										new BinaryOperator('+'),
										new CallExpression(new IdentifierExpression('fib'), [
											new BinaryExpression(
												new IdentifierExpression('n'),
												new BinaryOperator('-'),
												new NumberExpression(2)
											)
										])
									)
								)
							]
						)
					)
				)
			])
		])
	})

	test('map', () => {
		const tokens = tokenizer(`
			map = (f, x) => x
				| [] -> []
				| [x, ...xs] -> [f(x), ...map(f, xs)]
		`)
		const nodes = parse(tokens)
		expect(nodes).toEqual([
			new File([
				new Declaration(
					new IdentifierExpression('map'),
					new FunctionExpression(
						[new IdentifierExpression('f'), new IdentifierExpression('x')],
						new PatternExpression(
							[new IdentifierExpression('x')],
							[
								new PatternCase(
									[new ArrayExpression([])],
									new ArrayExpression([])
								),
								new PatternCase(
									[
										new ArrayExpression([
											new IdentifierExpression('x'),
											new RestElement(new IdentifierExpression('xs'))
										])
									],
									new ArrayExpression([
										new CallExpression(new IdentifierExpression('f'), [
											new IdentifierExpression('x')
										]),
										new RestElement(
											new CallExpression(new IdentifierExpression('map'), [
												new IdentifierExpression('f'),
												new IdentifierExpression('xs')
											])
										)
									])
								)
							]
						)
					)
				)
			])
		])
	})
})
