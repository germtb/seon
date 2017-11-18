export const traverse = (node, visitors, acc) => {
	const visitor = visitors[node.type]

	if (visitor && visitor.enter) {
		visitor.enter(node, acc)
	}

	node.getChildren().forEach(node => traverse(node, visitors, acc))

	if (visitor && visitor.exit) {
		visitor.exit(node, acc)
	}
}
