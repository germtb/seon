class Node {
	constructor(value, next) {
		this.value = value
		this.next = next
	}
}

class Array {
	constructor(head) {
		this.head = head
	}
}

const createArray = ()

export const createArray = values => {
	const lenght = values.length

	let node
	for (let i = 0; i < lenght - 1; i++) {
		let value = values[i]
		let newNode = new Node(value)
		node.next = newNode
		node = newNode
	}

	return new Array(head, tail, 0)
}

export const push = (node, array) => {}

export const pop = array => {}

export const queue = (node, array) => {}

export const dequeue = array => {}
