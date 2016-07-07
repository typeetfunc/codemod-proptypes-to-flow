import {uniq} from 'ramda'

export default classComp => {
    return uniq(
        classComp
        .find(j.MemberExpression, {
            computed: false,
            object: {
                type: 'ThisExpression'
            }
        })
        .paths()
        .map(expr => expr.value.name)
        .filter(prop => prop !== 'props')
    )
}