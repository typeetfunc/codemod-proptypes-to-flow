import {uniq, compose, concat, contains, append} from 'ramda'

const MATCH_THIS = {
    computed: false,
    object: {
        type: 'ThisExpression'
    }
}
const makeBlacklist = compose(uniq, append('props'), concat)
const notInBlacklist = list => val => !contains(val, list)

export default (j, classComp) => {
    const classCollection = j(classComp)

    const methods = classCollection
        .find(j.MethodDefinition)
        .paths()
        .map(expr => expr.value.key.name)
    const calls = classCollection
        .find(j.CallExpression, {
            callee: MATCH_THIS
        })
        .paths()
        .map(expr => expr.value.callee.property.name)
    const blacklist = makeBlacklist(methods, calls)

    return uniq(
        j(classComp)
        .find(j.MemberExpression, MATCH_THIS)
        .paths()
        .map(expr => expr.value.property.name)
        .filter(notInBlacklist(blacklist))
    )
}