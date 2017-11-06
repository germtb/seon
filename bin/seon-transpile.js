#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const path = require('path')
const run = require('../dist/transpiler').run

const pwd = process.env.PWD

const filename = path.resolve(pwd, argv._[0])
const file = fs.readFileSync(filename, 'utf8')

const transpiledFile = run(file)
console.log('transpiledFile: ', transpiledFile)
