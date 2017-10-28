#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const run = require('../dist/interpreter').run
const file = fs.readFileSync(argv['$0'], 'utf8')

run(file)
