const fs = require('fs')
const p = require('path')
const jscodeshift = require('jscodeshift')
const transform = require('../src/index.js')
const testFileName = 'example.js'

const read = fileName => fs.readFileSync(
  p.join(__dirname, fileName),
  'utf8'
);
const source = read(testFileName);

console.log(JSON.stringify(transform({path: testFileName, source}, {jscodeshift},  {}), null, 2)) 
