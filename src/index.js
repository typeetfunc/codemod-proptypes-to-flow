import findPropTypesWithDefaults from './helpers/findPropTypesWithDefaults'
import propTypesWithDefaultsToFlow from './helpers/propTypesWithDefaultsToFlow'
import {
    setImportToFile,
    setTypeAlias,
    setToComponent,
    setFlowMode,
    removePropTypes,
    setClassMembers
} from './helpers/setAnnotations'
import annotationsToPartOfComponent from './helpers/annotationsToPartComponent'
import annotationsToFile from './helpers/annotationsToFile'
import findClassMembers from './helpers/findClassMembers'

const DEFAULT_OPTIONS = {
    annotationToFile: false,
    generate: {
        arrowParensAlways: true,
        quote: 'single'
    },
    removePropTypes: false,
}

const FLOWMODE_MAPPING = {
    weak: 'flow weak',
    strict: 'flow',
    no: 'noflow'
}

export default function transformer(file, api, options) {
    const j = api.jscodeshift
    if (options.setFlowMode && !FLOWMODE_MAPPING[options.setFlowMode]) {
        throw new Error('Bad options: setFlowMode can be weak, strict or no')
    }
    const config = {
        ...DEFAULT_OPTIONS,
        ...options,
        ...(options.setFlowMode ? {
            setFlowMode: FLOWMODE_MAPPING[options.setFlowMode]
        } : {})
    }
    const {
        expression,
        statement,
        statements
    } = j.template
    const root = j(file.source)
    const typeWithDefault = findPropTypesWithDefaults(j, root)
    if (typeWithDefault.length === 0) {
        return;
    }
    const withAnnotations = propTypesWithDefaultsToFlow(j, typeWithDefault)
    const withAnnotationsInPart = withAnnotations
        .map(component => annotationsToPartOfComponent(j, component, withAnnotations.length === 1))

    let exportFile
    if (options.annotationToFile) {
        exportFile = annotationsToFile(j, file.path, withAnnotationsInPart, config.setFlowMode)
        setImportToFile(j, root, exportFile.importNode)
    } else {
        setTypeAlias(
            j,
            root,
            withAnnotationsInPart.reduce((acc, {
                propsAlias,
                defaultAlias
            }) => ([
                ...acc,
                propsAlias,
                ...(defaultAlias ? [defaultAlias] : [])
            ]), [])
        )
    }
    const useIsPretty = Boolean(withAnnotationsInPart.find(compWithAnnotation => j.VariableDeclarator.check(compWithAnnotation.component.node)))
    withAnnotationsInPart.forEach(compWithAnnotation => {
        if (j.ClassDeclaration.check(compWithAnnotation.component.node)) {
            const members = findClassMembers(j, compWithAnnotation.component)
            setClassMembers(j, compWithAnnotation.component, members)
        }
        setToComponent(j, compWithAnnotation)
    })
    if (config.removePropTypes) {
        removePropTypes(j, root)
    }
    let resultSource
    if (config.setFlowMode) {
        let rootWithComment = root
        if (useIsPretty) {
            rootWithComment = j(root.toSource(config.generate, useIsPretty))
        }
        setFlowMode(j, rootWithComment, config.setFlowMode)
        resultSource = rootWithComment.toSource(config.generate)
    } else {
        resultSource = root.toSource(config.generate, useIsPretty)
    }
    return exportFile ? [resultSource, {
            path: exportFile.path,
            source: exportFile.programNode.toSource(config.generate)
        }] :
        resultSource;
}