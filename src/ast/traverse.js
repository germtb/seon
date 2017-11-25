export const traverse = (node, visitors, acc) => {
	const visitor = visitors[node.type]

	if (visitor && visitor.map) {
		return visitor.map(node, acc)
	}

	if (visitor && visitor.enter) {
		visitor.enter(node, acc)
	}

	const finalNode = node.mapChildren(node => traverse(node, visitors, acc))

	if (visitor && visitor.exit) {
		visitor.exit(node, acc)
	}

	return finalNode
}
