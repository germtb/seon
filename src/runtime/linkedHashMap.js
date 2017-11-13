import { Node as LinkedListNode, cons } from './linkedList'

export const Node = () => ({
	hashMap: {},
	linkedList: LinkedListNode()
})

export const merge = (node1, node2) => {
	const hashMap = {}
	let length = 0

	for (let i = 0; i < node1.length; i++) {
		const key = node1.head
		const value = node1.hashMap[key]

		hashMap[key] = value
		length += 1
	}

	return {
		hashMap,
		length
	}
}

export const add = (node, key, value) => {
	const linkedList =
		key in node.hashMap ? node.linkedList : add(node.linkedList, key)

	return {
		hashMap: { ...node.hashMap, [key]: value },
		linkedList
	}
}

export const get = (node, key) => {
	if (key in node.hashMap) {
		return node.hashMap[key]
	}

	throw `${key} not present in hash map`
}
