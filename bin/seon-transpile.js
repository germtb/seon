#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const path = require('path')
const run = require('../dist/transpiler').run

const pwd = process.env.PWD

const filename = path.resolve(pwd, argv._[0])
const dirname = path.dirname(filename)
const file = fs.readFileSync(filename, 'utf8')

const runtimeModules = [
	'../src/runtime/core.js',
	'../src/runtime/debug.js',
	'../src/runtime/dict.js',
	'../src/runtime/createFunction.js',
	'../src/runtime/patternMatching.js',
	'../src/runtime/types.js'
]

const transpiledFile = run(file, dirname)
const output = argv.o

if (!output) {
	// eslint-disable-next-line
	console.log(transpiledFile)
} else {
	const runtime = runtimeModules.reduce((acc, filepath) => {
		const filename = path.resolve(__dirname, filepath)
		const file = fs.readFileSync(filename, 'utf8')
		return acc + '\n' + file
	}, '')

	const runtimeWithoutExports = runtime.replace(/export/g, '', '')
	const fileWithRuntime = runtimeWithoutExports + '\n' + transpiledFile

	fs.writeFileSync(output, fileWithRuntime, error => {
		if (error) {
			return console.error(error)
		}

		// eslint-disable-next-line
		console.log('The file was saved!')
	})
}
