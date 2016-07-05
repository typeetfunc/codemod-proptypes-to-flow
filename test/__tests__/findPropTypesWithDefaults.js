jest.autoMockOff();

const jscodeshift = require('jscodeshift');
const {
    default: findPropTypesWithDefaults,
    classDeclarationFromProp,
    findAnyByName,
    findStaticAndDynamicWithComp,
    isEqualComp,
    mergeByComponent
} = require('../../src/helpers/findPropTypesWithDefaults')
const j = jscodeshift
const {
    default: propTypesWithDefaultsToFlow,
    isEqualObjectExprKey
} = require('../../src/helpers/propTypesWithDefaultsToFlow')
const {
    default: annotationsToPartOfComponent,
    createTypeAlias,
createProperty,
isDefaultProps,
makeAlias
} = require('../../src/helpers/annotationsToPartComponent')
const transformer = require('../../src/index')
 
describe('find propTypes with defaultProps', () => {
  const code = `
    import React, { PropTypes as pt } from 'react';

    class ComponentName extends React.Component {
        static defaultProps = {
            aaa: 'bbbb'
        }
        static propTypes = {
            aaa: pt.string.isRequired
        };
        render() {

        }
    }


    var componentFunc = (params) => {};
    componentFunc.propTypes = {bbb: pt.string.isRequired};
    componentFunc.defaultProps = {bbb: 'aaa'};
  `;

 
 /* 
  it('mergeByComponent priotity first list', () => {
    const root = j(code)
    const propTypes = findStaticAndDynamicWithComp(j, root, 'propTypes')
    const emptyDefaultProps = []
    const merged = mergeByComponent(propTypes, emptyDefaultProps)

    expect(merged.length).toBe(2);
  })

  it('find and mapping annotations', () => {
    const root = j(code)
    const typeWithDefault = findPropTypesWithDefaults(j, root)
    const withAnnotations = propTypesWithDefaultsToFlow(j, typeWithDefault)
    expect(withAnnotations.length).toBe(2);
    expect(j(withAnnotations[0].propTypes).toSource()).toBe(`{
    aaa: pt.string.isRequired
}`)
     expect(j(withAnnotations[0].propTypesFlow).toSource()).toBe(`aaa: string`)
     expect(j(withAnnotations[0].defaultTypesFlow).toSource()).toBe(`aaa: string`)
     expect(j(withAnnotations[1].propTypes).toSource()).toBe(`{
    bbb: pt.string.isRequired
}`)
     expect(j(withAnnotations[1].propTypesFlow).toSource()).toBe(`bbb: string`)
     expect(j(withAnnotations[1].defaultTypesFlow).toSource()).toBe(`bbb: string`)
  });
*/
  it('its work', () => {
      const root = j(code)
      
    
  })
});