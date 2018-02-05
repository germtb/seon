#! /usr/local/bin/node

const { format } = require('prettier')
const argv = require('yargs').argv
const fs = require('fs')
const path = require('path')
const run = require('../dist/transpiler').run

const pwd = process.env.PWD

const filename = path.resolve(pwd, argv._[0])
const file = fs.readFileSync(filename, 'utf8')

const transpiledFile = run(file)
const output = argv.o || path.parse(filename).name + '.js'

fs.writeFileSync(output, format(transpiledFile, { semi: false }), error => {
	if (error) {
		return console.error(error)
	}

	// eslint-disable-next-line
	console.log('The file was saved!')
})
