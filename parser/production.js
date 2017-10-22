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
	// Nodes
	Node: ['Node'],
	File: ['File', 'Node'],
	Parameter: ['Parameter', 'Node'],
	ObjectProperty: ['ObjectProperty', 'Node'],
	BinaryOperator: ['BinaryOperator', 'Node'],
	UnaryOperator: ['UnaryOperator', 'Node'],
	PatternMatchingDefault: ['PatternMatchingDefault', 'Node'],
	PatternMatchingCase: ['PatternMatchingCase', 'Node'],
	PatternMatchingExpression: [
		'PatternMatchingExpression',
		'Expression',
		'Node'
	],
	RestElement: ['RestElement', 'Node'],

	// Patterns
	Pattern: ['Pattern', 'Node'],
	MultiPattern: ['MultiPattern', 'Pattern', 'Node'],
	AnyPattern: ['AnyPattern', 'Pattern', 'Node'],
	NumberPattern: ['NumberPattern', 'Pattern', 'Node'],
	BooleanPattern: ['BooleanPattern', 'Pattern', 'Node'],
	StringPattern: ['StringPattern', 'Pattern', 'Node'],
	ArrayPattern: ['ArrayPattern', 'Pattern', 'Node'],
	ObjectPattern: ['ObjectPattern', 'Pattern', 'Node'],
	NoPattern: ['NoPattern', 'Pattern', 'Node'],

	// Statements
	Statement: ['Statement', 'Node'],
	BlockStatement: ['BlockStatement', 'Statement', 'Node'],
	Declaration: ['Declaration', 'Statement', 'Node'],

	// Expressions
	Expression: ['Expression', 'Node'],
	IdentifierExpression: ['IdentifierExpression', 'Expression', 'Node'],
	BooleanExpression: ['BooleanExpression', 'Expression', 'Node'],
	NumberExpression: ['NumberExpression', 'Expression', 'Node'],
	StringExpression: ['StringExpression', 'Expression', 'Node'],
	ArrayExpression: ['ArrayExpression', 'Expression', 'Node'],
	ObjectExpression: ['ObjectExpression', 'Expression', 'Node'],
	ObjectAccessExpression: ['ObjectAccessExpression', 'Expression', 'Node'],
	FunctionExpression: ['FunctionExpression', 'Expression', 'Node'],
	CallExpression: ['CallExpression', 'Expression', 'Node'],
	BinaryExpression: ['BinaryExpression', 'Expression', 'Node'],
	UnaryExpression: ['UnaryExpression', 'Expression', 'Node'],
	ArrayAccessExpression: ['ArrayAccessExpression', 'Expression', 'Node']
}

const matches = (node, type) => {
	if (type === '||' && node === '||') {
		return true
	} else if (type === '|' && node === '|') {
		return true
	}

	return type.split('|').some(type => {
		if (matchTable[node]) {
			return matchTable[node].includes(type)
		} else {
			return node === type
		}
	})
}
