import findPropTypesWithDefaults from './helpers/findPropTypesWithDefaults'
import propTypesWithDefaultsToFlow from './helpers/propTypesWithDefaultsToFlow'
import { setImportToFile, setTypeAlias, setToComponent, setFlowMode, removePropTypes } from './helpers/setAnnotations'
import annotationsToPartOfComponent from './helpers/annotationsToPartComponent'
import annotationsToFile from './helpers/annotationsToFile'

const DEFAULT_OPTIONS = {
    annotationToFile: false,
    generate: {
        quote: 'single'
    },
    removePropTypes: false,
}

export default function transformer(file, api, options) {
  const j = api.jscodeshift
  const config = {
      ...DEFAULT_OPTIONS,
      ...options
  }
  const {expression, statement, statements} = j.template
  const root = j(file.source)
  const typeWithDefault = findPropTypesWithDefaults(j, root)
  if(typeWithDefault.length === 0) {
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
        withAnnotationsInPart.reduce((acc, {propsAlias, defaultAlias}) => ([
            ...acc,
            propsAlias,
            ...(defaultAlias ? [defaultAlias] : [])
        ]),[])
      )

  }
  withAnnotationsInPart.forEach(compWithAnnotation => setToComponent(j, compWithAnnotation))
  if(config.removePropTypes) {
    removePropTypes(j, root)
  }
  if (config.setFlowMode) {
    setFlowMode(j, root, config.setFlowMode)
  }
  return exportFile ?
    [root.toSource(config.generate), {path: exportFile.path, source: exportFile.programNode.toSource(config.generate)}] :
    root.toSource(config.generate);
}

