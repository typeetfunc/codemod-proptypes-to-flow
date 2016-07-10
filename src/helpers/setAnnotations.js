import {findStaticByName, findDynamicByName} from './findPropTypesWithDefaults'
import {makeFlowComment} from './annotationsToPartComponent'

function getProgramFile(file) {
    return file.paths()[0].value.program
}

function setAfterLastImport(j, file, ...nodes) {
    const program = getProgramFile(file)
    const importIdxs = program.body
        .map((node, i) => ([node, i]))
        .filter(([node, i]) => j.ImportDeclaration.check(node))
        .map(([node, i]) => i)
    const lastIdx = importIdxs.length > 0 ?
        importIdxs[importIdxs.length - 1] + 1 :
        0
    program.body.splice(lastIdx, 0, ...nodes)
}

export function setImportToFile(j, file, importNode) {
    setAfterLastImport(j, file, importNode)
}

export function setTypeAlias(j, file,  aliases) {
    setAfterLastImport(j, file, ...aliases)
}

export function createProperty(j, name, annotation, isStatic = false) {
    return j.classProperty(j.identifier(name), null, annotation, isStatic)
}

export function isDefaultProps(j, node) {
    return j.ClassProperty.check(node) && node.static && node.key.name === 'defaultProps';
}

export function setFlowMode(j, file, mode) {
    getProgramFile(file).comments = [
        makeFlowComment(j, mode),
        ...(getProgramFile(file).comments || [])
    ]
}

export function setToComponent(j, {component, propsAnnotation, defaultAnnotation}) {
    if (j.ClassDeclaration.check(component.node)) {
        const body = component.node.body.body
        const defaultProps = defaultAnnotation && body.find(prop => isDefaultProps(j, prop))        
        if (defaultAnnotation) {
            if (defaultProps) {
                defaultProps.typeAnnotation = defaultAnnotation
            } else {
                body.unshift(
                    createProperty(j, 'defaultProps', defaultAnnotation, true)
                )
            }
        }
        body.unshift(createProperty(j, 'props', propsAnnotation))
    } else if(j.FunctionDeclaration.check(component.node)) {
        if (component.node.params[0]) {
            component.node.params[0].typeAnnotation = propsAnnotation
        }
    } else if (j.VariableDeclarator.check(component.node)) {
        if (component.node.init.params[0]) {
            component.node.init.params[0].typeAnnotation = propsAnnotation
        }
    }
}

function isPropertyWithName(j, name, node) {
    return j.ClassProperty.check(node) && !node.static && node.key.name === name
}

export function setClassMembers(j, classComp, members) {
    const body = classComp.node.body.body
    members.forEach(({name, annotation}) => {
        body.unshift(createProperty(j, name, annotation))
    })
}


export function removePropTypes(j, file) {
    findStaticByName(j, file, 'propTypes').remove();
    findDynamicByName(j, file, 'propTypes').remove()
}