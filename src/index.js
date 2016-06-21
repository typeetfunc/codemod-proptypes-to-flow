import findPropTypesWithDefaults from './helpers/findPropTypesWithDefaults'
import propTypesWithDefaultsToFlow from './helpers/propTypesWithDefaultsToFlow'
import { setImportToFile, setTypeAlias, setToComponent } from './helpers/setAnnotations'
import annotationsToPartOfComponent from './helpers/annotationsToPartComponent'
import annotationsToFile from './helpers/annotationsToFile'

export default function transformer(file, api, options) {
  const j = api.jscodeshift
  const {expression, statement, statements} = j.template
  const root = j(file.source)
  const typeWithDefault = findPropTypesWithDefaults(j, root)
  const withAnnotations = propTypesWithDefaultsToFlow(j, typeWithDefault)
  const withAnnotationsInPart = withAnnotations
    .map(component => annotationsToPartOfComponent(j, component, withAnnotations.length === 1))
  let exportFile
  if (options.export) {
    const exportFile = annotationsToFile(j, file.name, withAnnotationsInPart)
    setImportToFile(j, root, exportFile.importNode)
  } else {
      withAnnotationsInPart.forEach(compWithAnnotation => setTypeAlias(j, root, compWithAnnotation))
      console.log(root.toSource())
  }
  withAnnotationsInPart.forEach(compWithAnnotation => setToComponent(j, compWithAnnotation))

  return exportFile ?
    [root.toSource(), {path: exportFile.fileName, source: exportFile.programNode.toSource()}] :
    root.toSource();
}


function transformerOLD(file, api) {
  const j = api.jscodeshift;
  const {expression, statement, statements} = j.template;
  let root = j(file.source);
  let requiredProps = new Set();
  let hasStaticProps;

  let nonStaticQuery;
  const staticPropsQuery = findStaticByName(j, root, 'propTypes');

  hasStaticProps = staticPropsQuery.size();

  if (hasStaticProps) {
  // Replace React.PropTypes
    root = staticPropsQuery.replaceWith(p => {
      if (p && p.value && p.value.value) {
        findIsRequired(j, j(p.value.value)).replaceWith(p => {
          requiredProps.add(
            p.parentPath.value.key.name
          );

          return p.value.object;
        }).toSource();
        p.value.value.properties.map((prop) => {
          return j(prop).find(j.MemberExpression, {
            object: {
                type: 'Identifier',
                name: 'React',
            },
            property: {
                type: 'Identifier',
                name: 'PropTypes',
            }
          }).replaceWith(p => p.value.property);
        });
      }
      return p.value;
    }).toSource();
  } else {
    nonStaticQuery = j(file.source).find(j.AssignmentExpression, {
      left: {
        property: {
          name: 'propTypes',
        },
      },
    });

    root = nonStaticQuery.replaceWith(p => {
      if (p && p.value && p.value.right) {
        findIsRequired(j, j(p.value.right.properties)).replaceWith(p => {
          requiredProps.add(
            p.parentPath.value.key.name
          );

          return p.value.object;
        }).toSource();
        p.value.right.properties.map((prop) => {
          return j(prop).find(j.MemberExpression, {
            object: {
              type: 'Identifier',
              name: 'React',
            },
            property: {
              type: 'Identifier',
              name: 'PropTypes',
            }
          }).replaceWith(p => p.value.property);
          return prop;
        });
      }
      return p.value;
    }).toSource();
  }


  // Look for propTypes

  let flowTypes;
  const query = hasStaticProps ?
    j(root)
    .find(j.ClassProperty, {
      key: {
        name: 'propTypes'
      }
    })
    :
    j(root).find(j.AssignmentExpression, {
      left: {
        property: {
          name: 'propTypes',
        },
      },
    });


  root = query.forEach(
    p => {
      const properties = hasStaticProps ? p.value.value.properties :
      p.value.right.properties;
      
      flowTypes = properties.map(property => {
        //console.log(findPropType(property.value));
        //console.log(property, j(property).find(j.Identifier).map(p => console.log(p)))//, p.parent.parent.value.property)));
        const optional = !requiredProps.has(property.key.name);
        const t = propTypeToFlowType(j, property.key, property.value);
        t.comments = property.comments;
        return t;
      });
    }
  )
  .replaceWith(p => '')
  .toSource();

  if (flowTypes) {
    const flowTypeProps = j.exportNamedDeclaration(j.typeAlias(
      j.identifier('Props'), null, j.objectTypeAnnotation(flowTypes)
    ));

    return j(root).forEach(p => {
      let index;
      p.value.program.body.filter((p, i) => {
        let found;
        const classExpression = j(p).find(j.ClassDeclaration);
        if (classExpression.size()) {
          index = i;
          found = classExpression;
        } else {
          if (p.type === 'ClassDeclaration') {
            index = i;
            found = p;
          }
        }
        let propTypeAnnotationIndex = 0;

        if (found) {
          // found our class declaration, lets find constructor
          found.body.body.some((b, i) => {
            if (b.kind === 'constructor') {
              propTypeAnnotationIndex = i + 1;
              b.value.params
              .forEach(param => {
                if (param.name === 'props') {
                  param.typeAnnotation = j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Props'), null));
                }
              });
              return true;
            }
          });
          found.body.body.splice(
            propTypeAnnotationIndex,
            0,
            j.classProperty(
              j.identifier('props'),
              null,
              j.typeAnnotation(
                j.genericTypeAnnotation(j.identifier('Props'), null)
              )
           	)
          );
        }
        return found;
      });
      p.value.program.body.splice(index, 0, flowTypeProps);
    }).toSource({quote: 'single', trailingComma: true });
  } else {
    return j(root).toSource({quote: 'single' });
  }

};

