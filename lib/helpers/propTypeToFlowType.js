'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = propTypeToFlowType;

var _fixMeType = require('./fixMeType');

var _fixMeType2 = _interopRequireDefault(_fixMeType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getExpressionWithoutRequired(inputNode) {
    var required = false;
    var node = inputNode;

    if (inputNode.property && inputNode.property.name === 'isRequired') {
        required = true;
        node = inputNode.object;
    }

    return {
        required: required,
        node: node
    };
}

function getPropTypeExpression(j, inputNode) {
    var base = inputNode.callee || inputNode.object;

    if (inputNode.object && inputNode.object.object && inputNode.object.object.name === 'React') {
        return j.memberExpression(inputNode.object.property, inputNode.property);
    } else if (inputNode.object && inputNode.object.name === 'React') {
        return inputNode.property;
    }
    return inputNode;
}

function makeTransformMap(j) {
    var reactElement = j.genericTypeAnnotation(j.qualifiedTypeIdentifier(j.identifier('React'), j.identifier('Element')), j.typeParameterInstantiation([j.anyTypeAnnotation()]));
    var numberOrStringOrElement = [j.numberTypeAnnotation(), j.stringTypeAnnotation(), reactElement];
    return {
        any: j.anyTypeAnnotation(),
        bool: j.booleanTypeAnnotation(),
        func: j.genericTypeAnnotation(j.identifier('Function'), null),
        number: j.numberTypeAnnotation(),
        object: j.genericTypeAnnotation(j.identifier('Object'), null),
        string: j.stringTypeAnnotation(),
        str: j.stringTypeAnnotation(),
        array: j.genericTypeAnnotation(j.identifier('Array'), j.typeParameterInstantiation([j.anyTypeAnnotation()])),
        element: reactElement,
        node: j.unionTypeAnnotation([].concat(numberOrStringOrElement, [j.genericTypeAnnotation(j.identifier('Array'), j.typeParameterInstantiation([j.unionTypeAnnotation(numberOrStringOrElement)]))]))
    };
}

function makeTransFormMapForTypeOf(j) {
    var oneOfFunc = function oneOfFunc(node, declarators) {
        return j.unionTypeAnnotation(node.arguments[0].elements.map(function (arg) {
            return propTypeToFlowType(j, null, arg, declarators);
        }));
    };

    return {
        instanceOf: function instanceOf(node) {
            return j.genericTypeAnnotation(node.arguments[0], null);
        },
        arrayOf: function arrayOf(node, declarators) {
            return j.genericTypeAnnotation(j.identifier('Array'), j.typeParameterInstantiation([propTypeToFlowType(j, null, node.arguments[0] || j.anyTypeAnnotation(), declarators)]));
        },
        objectOf: function objectOf(node, declarators) {
            return j.genericTypeAnnotation(j.identifier('Object'), j.typeParameterInstantiation([propTypeToFlowType(j, null, node.arguments[0] || j.anyTypeAnnotation(), declarators)]));
        },
        shape: function shape(node, declarators) {
            return j.objectTypeAnnotation(node.arguments[0].properties.map(function (arg) {
                return propTypeToFlowType(j, arg.key, arg.value, declarators);
            }));
        },
        oneOfType: oneOfFunc,
        oneOf: oneOfFunc
    };
}

var TYPE_CONVERTERS = {
    Literal: function Literal(j, node) {
        return j.stringLiteralTypeAnnotation(node.value, node.raw);
    },
    MemberExpression: function MemberExpression(j, node, declarators) {
        var transformMap = makeTransformMap(j);

        return declarators[node.property.name] ? j.identifier(declarators[node.property.name]) : transformMap[node.property.name];
    },
    CallExpression: function CallExpression(j, node, declarators) {
        var name = node.callee.property.name;
        var transformMap = makeTransFormMapForTypeOf(j);

        return transformMap[name] ? transformMap[name](node, declarators) : null;
    },
    ObjectExpression: function ObjectExpression(j, node, declarators) {
        return j.objectTypeAnnotation(node.arguments.map(function (arg) {
            return propTypeToFlowType(j, arg.key, arg.value, declarators);
        }));
    },
    Identifier: function Identifier(j, node, declarators) {
        return declarators[node.name] ? j.identifier(declarators[node.name]) : null;
    }
};

function propTypeToFlowType(j, key, value) {
    var declarators = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var _getExpressionWithout = getExpressionWithoutRequired(value);

    var required = _getExpressionWithout.required;
    var node = _getExpressionWithout.node;

    // Check for React namespace for MemberExpressions (i.e. React.PropTypes.string)

    if (node.object) {
        node = j.memberExpression(getPropTypeExpression(j, node.object), node.property);
    } else if (node.callee) {
        node = j.callExpression(getPropTypeExpression(j, node.callee), node.arguments);
    }

    var returnValue = TYPE_CONVERTERS[node.type] && TYPE_CONVERTERS[node.type](j, node, declarators) || (0, _fixMeType2.default)(j);

    if (!key) {
        return returnValue;
    } else {
        return j.objectTypeProperty(key, returnValue, !required);
    }
}
module.exports = exports['default'];