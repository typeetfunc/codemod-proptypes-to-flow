import flowFixMeType from './fixMeType'

function getExpressionWithoutRequired(inputNode) {
    let required = false;
    let node = inputNode;

    if (inputNode.property && inputNode.property.name === 'isRequired') {
        required = true;
        node = inputNode.object;
    }

    return {
        required,
        node,
    }
}

function getPropTypeExpression(j, inputNode) {
    const base = inputNode.callee || inputNode.object;

    if (inputNode.object &&
        inputNode.object.object &&
        inputNode.object.object.name === 'React') {
        return j.memberExpression(
            inputNode.object.property,
            inputNode.property
        )
    } else if (inputNode.object && inputNode.object.name === 'React') {
        return inputNode.property;
    }
    return inputNode;
}

function makeTransformMap(j) {
    const reactElement = j.genericTypeAnnotation(
        j.qualifiedTypeIdentifier(j.identifier('React'), j.identifier('Element')),
        j.typeParameterInstantiation([
            j.anyTypeAnnotation()
        ])
    )
    const numberOrStringOrElement = [
        j.numberTypeAnnotation(),
        j.stringTypeAnnotation(),
        reactElement
    ]
    return {
        any: j.anyTypeAnnotation(),
        bool: j.booleanTypeAnnotation(),
        func: j.genericTypeAnnotation(j.identifier('Function'), null),
        number: j.numberTypeAnnotation(),
        object: j.genericTypeAnnotation(j.identifier('Object'), null),
        string: j.stringTypeAnnotation(),
        str: j.stringTypeAnnotation(),
        array: j.genericTypeAnnotation(
            j.identifier('Array'), j.typeParameterInstantiation(
                [j.anyTypeAnnotation()]
            )
        ),
        element: reactElement,
        node: j.unionTypeAnnotation([
            ...numberOrStringOrElement,
            j.genericTypeAnnotation(
                j.identifier('Array'), j.typeParameterInstantiation(
                    [
                        j.unionTypeAnnotation(numberOrStringOrElement)
                    ]
                )
            ),
        ]),
    }
}

function makeTransFormMapForTypeOf(j) {
    const oneOfFunc = (node, declarators) => j.unionTypeAnnotation(
        node.arguments[0].elements.map(arg => propTypeToFlowType(j, null, arg, declarators))
    )

    return {
        instanceOf: node => j.genericTypeAnnotation(node.arguments[0], null),
        arrayOf: (node, declarators) => j.genericTypeAnnotation(
            j.identifier('Array'), j.typeParameterInstantiation(
                [propTypeToFlowType(j, null, node.arguments[0] || j.anyTypeAnnotation(), declarators)]
            )
        ),
        objectOf: (node, declarators) => j.genericTypeAnnotation(
            j.identifier('Object'), j.typeParameterInstantiation(
                [propTypeToFlowType(j, null, node.arguments[0] || j.anyTypeAnnotation(), declarators)]
            )
        ),
        shape: (node, declarators) => j.objectTypeAnnotation(
            node.arguments[0].properties.map(arg => propTypeToFlowType(j, arg.key, arg.value, declarators))
        ),
        oneOfType: oneOfFunc,
        oneOf: oneOfFunc
    }
}

const TYPE_CONVERTERS = {
    Literal: (j, node) => j.stringLiteralTypeAnnotation(node.value, node.raw),
    MemberExpression: (j, node, declarators) => {
        const transformMap = makeTransformMap(j)

        return declarators[node.property.name] ?
            j.identifier(declarators[node.property.name]) :
            transformMap[node.property.name]
    },
    CallExpression: (j, node, declarators) => {
        const name = node.callee.property.name;
        const transformMap = makeTransFormMapForTypeOf(j)

        return transformMap[name] ? transformMap[name](node, declarators) : null
    },
    ObjectExpression: (j, node, declarators) => j.objectTypeAnnotation(
        node.arguments.map(arg => propTypeToFlowType(j, arg.key, arg.value, declarators))
    ),
    Identifier: (j, node, declarators) => declarators[node.name] ?
        j.identifier(declarators[node.name]) : null
}

export default function propTypeToFlowType(j, key, value, declarators = {}) {
    let {
        required,
        node
    } = getExpressionWithoutRequired(value);

    // Check for React namespace for MemberExpressions (i.e. React.PropTypes.string)
    if (node.object) {
        node = j.memberExpression(
            getPropTypeExpression(j, node.object),
            node.property
        )
    } else if (node.callee) {
        node = j.callExpression(
            getPropTypeExpression(j, node.callee),
            node.arguments
        )
    }

    const returnValue = TYPE_CONVERTERS[node.type] && TYPE_CONVERTERS[node.type](j, node, declarators) || flowFixMeType(j)

    if (!key) {
        return returnValue;
    } else {
        return j.objectTypeProperty(key, returnValue, !required);
    }
}