export const Node = (value, next) => ({
	value,
	next,
	length: 1 + next ? next.length : 0
})

export const cons = (node, next) => {
	if (next === null) {
		return node
	}

	node.next = next
	node.length = 1 + next.length
	return node
}

export const length = node => {
	return node.length
}
