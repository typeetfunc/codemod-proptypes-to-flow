jest.autoMockOff();
var diff = require('deep-diff')
/*
const getParser = require('../../node_modules/jscodeshift/dist/getParser')
const jscodeshift = require('jscodeshift');
const j = jscodeshift
const file = j(`props => {}`)
const reprintend = file.toSource({
    arrowParensAlways: true
})
console.log(reprintend)
const file2 = j(reprintend)

file2.paths()[0].value.program.body[0].expression.params[0].typeAnnotation = j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Props'), null))
console.log(
    file2.toSource()
)
*/
const recast = require('recast');
const b = recast.types.builders;
const ast = recast.parse(`props => {}`)
var propsParam = b.identifier('props')
propsParam.typeAnnotation = b.typeAnnotation(b.genericTypeAnnotation(b.identifier('Props'), null))
var arrowFunc = b.arrowFunctionExpression(
        [propsParam],
        b.blockStatement([])
)

ast.program.body[0].expression = arrowFunc
var ast1 = b.file(b.program(
    [b.expressionStatement(arrowFunc)]
))

console.log(diff(ast.program, ast1.program))
console.log(JSON.stringify(ast, null, 2))
console.log(JSON.stringify(ast1, null, 2))


console.log(recast.prettyPrint(ast).code)
console.log(recast.prettyPrint(ast1).code)
