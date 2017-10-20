export class Production {
	constructor(terminals, generator, onPeek = () => true) {
		this.terminals = terminals
		this.generator = generator
		this.onPeek = onPeek
	}

	matches(nodes, peek) {
		const nodeTypes = nodes.map(r => r.type)
		return (
			this.terminals.length === nodeTypes.length &&
			nodeTypes.reduce(
				(acc, node, index) => acc && matches(node, this.terminals[index]),
				true
			) &&
			this.onPeek(peek, ...nodes)
		)
	}
}

const matchTable = {
	Node: ['Node'],
	File: ['File', 'Node'],
	Parameter: ['Parameter', 'Node'],
	BinaryOperator: ['BinaryOperator', 'Node'],
	UnaryOperator: ['UnaryOperator', 'Node'],
	PatternMatchingDefault: ['PatternMatchingDefault', 'Node'],
	PatternMatchingCase: ['PatternMatchingCase', 'Node'],
	PatternMatchingExpression: [
		'PatternMatchingExpression',
		'Expression',
		'Node'
	],

	Statement: ['Statement', 'Node'],
	BlockStatement: ['BlockStatement', 'Statement', 'Node'],
	Declaration: ['Declaration', 'Statement', 'Node'],

	Expression: ['Expression', 'Node'],
	IdentifierExpression: ['IdentifierExpression', 'Expression', 'Node'],
	BooleanExpression: ['BooleanExpression', 'Expression', 'Node'],
	NumberExpression: ['NumberExpression', 'Expression', 'Node'],
	StringExpression: ['StringExpression', 'Expression', 'Node'],
	EmptyArrayExpression: ['EmptyArrayExpression', 'Expression', 'Node'],
	ArrayExpression: ['ArrayExpression', 'Expression', 'Node'],
	FunctionExpression: ['FunctionExpression', 'Expression', 'Node'],
	CallExpression: ['CallExpression', 'Expression', 'Node'],
	BinaryExpression: ['BinaryExpression', 'Expression', 'Node'],
	UnaryExpression: ['UnaryExpression', 'Expression', 'Node'],
	ArrayAccessExpression: ['ArrayAccessExpression', 'Expression', 'Node']
}

const matches = (node, type) => {
	if (matchTable[node]) {
		return matchTable[node].includes(type)
	} else {
		return node === type
	}
}
