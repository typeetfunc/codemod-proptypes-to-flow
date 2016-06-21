export function setImportToFile(j, file, importNode) {
    file.value.program.body.unshift(importNode)
}
export function setTypeAlias(j, file,  {propsAlias, defaultAlias}) {
    const aliases = defaultAlias ? [propsAlias, defaultAlias] : [propsAlias]; 
    const program = file.paths()[0].value.program
    aliases.forEach(node => program.body.unshift(node))
   

    return;
   /* const imports = file.find(j.ImportDeclaration).paths()

    if(imports.length) {
        imports[imports.length - 1].insertAfter(aliases)
    } else {
        aliases.forEach(node => program.body.unshift(node)) 
    } */
    
}


export function createProperty(j, name, annotation, isStatic = false) {
    return j.classProperty(j.identifier(name), null, annotation, isStatic)
}

export function isDefaultProps(j, node) {
    return j.classProperty.check(prop) && prop.static && prop.key.name === 'defaultProps';
}


export function setToComponent(j, {component, propsAnnotation, defaultAnnotation}) {
    if (j.ClassDeclaration.check(component.node)) {
        const body = component.node.body.body
        const defaultProps = defaultAnnotation && body.find(prop => isDefaultProps(j, prop))
        body.unshift(createProperty(j, 'props', propsAnnotation))
        if (defaultAnnotation) {
            if (defaultProps) {
                defaultProps.typeAnnotation = defaultAnnotation
            } else {
                body.unshift(
                    createProperty(j, 'defaultProps', defaultAnnotation, true)
                )
            }
        }
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