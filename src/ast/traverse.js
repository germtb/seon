export const traverse = (node, visitors, acc) => {
	const visitor = visitors[node.type]

	if (visitor && visitor.flatMap) {
		return visitor.flatMap(node, acc)
	}

	if (visitor && visitor.enter) {
		visitor.enter(node, acc)
	}

	const result = node.flatMapChildren(c => traverse(c, visitors, acc))

	if (visitor && visitor.exit) {
		visitor.exit(node, acc)
	}

	return [result]
}
