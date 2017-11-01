#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const path = require('path')
const run = require('../dist/interpreter').run

// Convert js core libraries into seon core modules
const InternalCore = require('../core-js/InternalCore')
const InternalDebug = require('../core-js/InternalDebug')

const jsLibraries = {
	InternalCore: { type: 'Object', value: InternalCore },
	InternalDebug: { type: 'Object', value: InternalDebug }
}

// Add seon core modules to the internal module system
// note: the order of the modules is important
const nativeLibraries = [
	'../core/Debug',
	'../core/Maybe',
	'../core/Either',
	'../core/String',
	'../core/Errable',
	'../core/List',
	'../core/Either',
	'../core/Test'
]

const coreModules = nativeLibraries.reduce((acc, filepath) => {
	const basename = path.basename(filepath)
	const filename = path.resolve(__dirname, filepath) + '.sn'
	const dirname = path.dirname(filename)
	const file = fs.readFileSync(filename, 'utf8')
	const moduleScope = [{ filename, dirname }]
	run(file, moduleScope, { modules: acc })
	const module = moduleScope[0].module
	acc[basename] = module
	return acc
}, jsLibraries)

const pwd = process.env.PWD
const filename = path.resolve(pwd, argv._[0])
const dirname = path.dirname(filename)
const file = fs.readFileSync(filename, 'utf8')

run(file, [{ filename, dirname }], { modules: coreModules })
