#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const path = require('path')
const run = require('../dist/interpreter').run

const pwd = process.env.PWD
const filename = path.resolve(pwd, argv._[0])
const dirname = path.dirname(filename)
const file = fs.readFileSync(filename, 'utf8')

const toString = (x, tabulation = '') => {
	if (x.type === 'NumberExpression') {
		return x.value
	} else if (x.type === 'BooleanExpression') {
		return x.value ? 'true' : 'false'
	} else if (x.type === 'StringExpression') {
		return x.value
	} else if (x.type === 'FunctionExpression') {
		return 'FunctionExpression'
	} else if (x.type === 'ObjectExpression') {
		if (x.properties.length === 0) {
			return '{}'
		} else if (x.properties.length === 1) {
			return '{ ' + toString(x.properties[0]) + ' }'
		}

		return (
			'{\n' +
			x.properties.map(p => toString(p, tabulation + '  ')).join('\n') +
			'\n}'
		)
	} else if (x.type === 'ObjectProperty') {
		return (
			tabulation +
			x.property.name +
			': ' +
			toString(x.property.value, tabulation)
		)
	} else if (x.type === 'ArrayExpression') {
		return '[' + x.values.map(toString).join(', ') + ']'
	}

	return ''
}

const log = {
	type: 'Function',
	call: params => {
		const logResult = params.map(p => toString(p)).join(' ')
		// eslint-disable-next-line
		console.log(logResult)
	}
}

run(file, [{ filename, dirname, log }])
