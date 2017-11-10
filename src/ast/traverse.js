export const traverse = (node, visitors, acc) => {
	const visitor = visitors[node.type]

	if (visitor && visitor.flatMap) {
		return { array: true, values: visitor.flatMap(node, acc) }
	} else if (visitor && visitor.map) {
		return visitor.map(node, acc)
	}

	if (visitor && visitor.enter) {
		visitor.enter(node, acc)
	}

	const result = node.flatMapChildren(c => {
		return traverse(c, visitors, acc)
	})

	if (visitor && visitor.exit) {
		visitor.exit(node, acc)
	}

	return [result]
}
