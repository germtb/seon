export const IdentifierExpression = name => ({
	type: 'IdentifierExpression',
	name
})

export const RestElement = name => ({
	type: 'RestElement',
	value: {
		name
	}
})

export const ObjectExpression = properties => ({
	type: 'ObjectExpression',
	properties
})
