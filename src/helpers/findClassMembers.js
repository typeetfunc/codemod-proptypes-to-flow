import {uniq, compose, concat, contains, append, uniqBy, prop} from 'ramda'
import flowFixMeType from './fixMeType'

const MATCH_THIS = {
    computed: false,
    object: {
        type: 'ThisExpression'
    }
}
const makeBlacklist = compose(uniq, concat(['props', 'context']))
const notInBlacklist = list => val => !contains(val, list)
const uniqByName = uniqBy(prop('name'))

export default (j, classComp) => {
    const declared = classComp.node.body.body.map(propOrMethod => propOrMethod.key.name)
    const blacklist = makeBlacklist(declared)
    const checker = notInBlacklist(blacklist)

    return uniqByName(
        j(classComp)
        .find(j.MemberExpression, MATCH_THIS)
        .paths()
        .filter(expr => checker(expr.value.property.name))
        .map(expr => ({
            name: expr.value.property.name,
            annotation: j.CallExpression.check(expr.parent.node) ?
                j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Function'), null)) :
                j.typeAnnotation(flowFixMeType(j))
        }))
    )
}