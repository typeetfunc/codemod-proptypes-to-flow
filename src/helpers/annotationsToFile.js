import * as path from 'path'

export default function annotationsToFile(j, fileName, annotations) {
    const importFileName = fileName.replace(/(\.\w+?)$/, '.flow')
    const importNode = j.importDeclaration(
        annotations.reduce((acc, {defaultPropsName, propTypesName}) => ([
            ...acc,
            j.importSpecifier(j.identifier(propTypesName)),
            ...(defaultPropsName ?
                [j.importSpecifier(j.identifier(defaultPropsName))] :
                []
            )
        ]),
        []),
        path.join('.', importFileName)
    )
    importNode.importKind = 'type'    
    const body = annotations.map(({propsAlias, defaultAlias}) => j.exportNamedDeclaration(propsAlias),
        ...(defaultAlias ?
            [j.exportNamedDeclaration(defaultAlias)] :
            [])
    )    
    return {
        programNode: j.program(body),
        importNode,
        fileName: importFileName
    }
}