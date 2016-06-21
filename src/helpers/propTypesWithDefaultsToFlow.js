import propTypeToFlowType from './propTypeToFlowType'

export function isEqualObjectExprKey(key1, key2) {
    return (key1.name || key1.value) ===  (key2.name || key2.value)
}

export default function propTypesWithDefaultsToFlow(j, propTypesWithDefaults) {
  return propTypesWithDefaults
    .map(({component, propTypes, defaultProps}) => {
      const annotations = propTypes.properties.map(prop => {
        const t = propTypeToFlowType(j, prop.key, prop.value)
        t.comments = prop.comments
        return t
      })
      if (defaultProps && defaultProps.properties.length) {
        const defaultAnnotations = defaultProps
          .properties
          .map(prop => annotations.find(({key}) => isEqualObjectExprKey(key, prop.key)))
          .filter(val => val)
        return {component, propTypes, propTypesFlow: annotations, defaultTypesFlow: defaultAnnotations}
      } else {
        return {component, propTypes, propTypesFlow: annotations}
      }
    })
}
