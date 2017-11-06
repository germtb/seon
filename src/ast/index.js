export const visitFactory = visitors => {
	const visit = (node, acc) => {
		const visitor = visitors[node.type]
		if (visitor) {
			visitor(node, acc, visit)
		}
	}

	return visit
}
