export function makeTypeAnnotation(j, name) {
    return j.typeAnnotation(
        j.genericTypeAnnotation(
            j.identifier(name),
            null
        )
    )
}
export function createTypeAlias(j, name, flowTypes) {
  return j.typeAlias(
    j.identifier(name), null, j.objectTypeAnnotation(flowTypes)
  )
}



export function makeAlias(
        j,
        {component, propTypesFlow, defaultTypesFlow},
        isOneComponentInFile = true
) {
    const componentName = component.value.id.name
    const propTypesName = isOneComponentInFile ? 'Props' : componentName + 'Props'
    const defaultPropsName = isOneComponentInFile ? 'DefaultProps' : componentName + 'DefaultProps'

    return {
        propsAlias: createTypeAlias(
            j,
            propTypesName,
            propTypesFlow
        ),
        propTypesName,
        ...(defaultTypesFlow ?
            {
                defaultAlias: createTypeAlias(
                    j,
                    defaultPropsName,
                    defaultTypesFlow
                ),
                defaultPropsName
            } :
            {})
    }
}

export default function annotationsToPartOfComponent(
        j,
        {component, propTypesFlow, defaultTypesFlow},
        isOneComponentInFile = true
    ) {
    const { propsAlias, defaultAlias, defaultPropsName, propTypesName } = makeAlias(
        j,
        {component, propTypesFlow, defaultTypesFlow},
        isOneComponentInFile
    )

    return {
        component,
        propsAlias,
        defaultAlias,
        defaultPropsName,
        propTypesName,
        propsAnnotation: makeTypeAnnotation(j, propTypesName),
        defaultAnnotation: defaultAlias ? makeTypeAnnotation(j, defaultPropsName) : undefined
    }
}


export function makeFlowComment(j, flowmode) {
    return j.commentBlock(` @${flowmode} `)
}