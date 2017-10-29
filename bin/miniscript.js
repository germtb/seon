#! /usr/local/bin/node

const argv = require('yargs').argv
const fs = require('fs')
const path = require('path')
const msCore = require('./ms-core')
const run = require('../dist/interpreter').run

const pwd = process.env.PWD
const filename = path.resolve(pwd, argv._[0])
const dirname = path.dirname(filename)
const file = fs.readFileSync(filename, 'utf8')

run(file, [{ filename, dirname, ...msCore }])
