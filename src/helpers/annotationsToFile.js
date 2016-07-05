import * as path from 'path'
import {makeFlowComment} from './annotationsToPartComponent'

export default function annotationsToFile(j, filePath, annotations, flowmode) {
    const dir = path.dirname(filePath)
    const importFileName = path.basename(filePath).replace(/(\.\w+?)$/, '.flow$1')
    const importFilePath = path.format({
        dir,
        base: importFileName
    })
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
        j.literal(path.format({dir: '.', base: importFileName}))
    )
    importNode.importKind = 'type'
    const body = annotations.reduce((acc, {propsAlias, defaultAlias}) => ([
        ...acc,
        j.exportNamedDeclaration(propsAlias),
        ...(defaultAlias ? [j.exportNamedDeclaration(defaultAlias)] : [])
    ]), [])
    const program = j.program(body)
    if (flowmode) {
        program.comments = [makeFlowComment(j, flowmode)]
    }

    return {
        programNode: j(program),
        importNode,
        path: importFilePath
    }
}