#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')
const run = require('../dist/transpiler').run

const pwd = process.env.PWD

const filename = path.resolve(pwd, argv._[0])
const file = fs.readFileSync(filename, 'utf8')

const runtimeModules = [
	'../src/runtime/createFunction.js',
	'../src/runtime/patternMatching.js',
	'../src/runtime/types.js'
]

const runtime = runtimeModules.reduce((acc, filepath) => {
	const filename = path.resolve(__dirname, filepath)
	const file = fs.readFileSync(filename, 'utf8')
	return acc + '\n' + file.replace('export ', '')
}, '')

const transpiledFile = run(file)
const fileWithRuntime = runtime + '\n' + transpiledFile

exec(`node -e "${fileWithRuntime}"`, (error, stdout, stderr) => {
	// eslint-disable-next-line
	console.log('stdout: ', stdout)
	// eslint-disable-next-line
	console.log('stderr: ', stderr)
	if (error !== null) {
		// eslint-disable-next-line
		console.log('exec error: ' + error)
	}
})
