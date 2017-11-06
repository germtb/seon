#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const path = require('path')
const run = require('../dist/transpiler').run

const pwd = process.env.PWD

const filename = path.resolve(pwd, argv._[0])
const file = fs.readFileSync(filename, 'utf8')

const transpiledFile = run(file)

exec(`node -e ${transpiledFile}`, (error, stdout, stderr) => {
	// eslint-disable-next-line
	console.log('stdout: ', stdout)
	// eslint-disable-next-line
	console.log('stderr: ', stderr)
	if (error !== null) {
		// eslint-disable-next-line
		console.log('exec error: ' + error)
	}
})
