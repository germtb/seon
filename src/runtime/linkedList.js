export const Node = (value, next) => ({
	value,
	next,
	length: 1 + next ? next.length : 0
})

export const join = (node, next) => {
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

// map = (f, list) => match list
//   | [] -> []
//   | [ x, ...xs ] -> [ f(x), ... map(f, xs) ]
