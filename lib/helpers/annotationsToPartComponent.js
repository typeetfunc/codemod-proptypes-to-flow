'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.makeTypeAnnotation = makeTypeAnnotation;
exports.createTypeAlias = createTypeAlias;
exports.makeAlias = makeAlias;
exports.default = annotationsToPartOfComponent;
exports.makeFlowComment = makeFlowComment;
function makeTypeAnnotation(j, name) {
    return j.typeAnnotation(j.genericTypeAnnotation(j.identifier(name), null));
}
function createTypeAlias(j, name, flowTypes) {
    return j.typeAlias(j.identifier(name), null, j.objectTypeAnnotation(flowTypes));
}

function makeAlias(j, _ref) {
    var component = _ref.component;
    var propTypesFlow = _ref.propTypesFlow;
    var defaultTypesFlow = _ref.defaultTypesFlow;
    var isOneComponentInFile = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var componentName = component.value.id.name;
    var propTypesName = isOneComponentInFile ? 'Props' : componentName + 'Props';
    var defaultPropsName = isOneComponentInFile ? 'DefaultProps' : componentName + 'DefaultProps';

    return _extends({
        propsAlias: createTypeAlias(j, propTypesName, propTypesFlow),
        propTypesName: propTypesName
    }, defaultTypesFlow ? {
        defaultAlias: createTypeAlias(j, defaultPropsName, defaultTypesFlow),
        defaultPropsName: defaultPropsName
    } : {});
}

function annotationsToPartOfComponent(j, _ref2) {
    var component = _ref2.component;
    var propTypesFlow = _ref2.propTypesFlow;
    var defaultTypesFlow = _ref2.defaultTypesFlow;
    var isOneComponentInFile = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    var _makeAlias = makeAlias(j, { component: component, propTypesFlow: propTypesFlow, defaultTypesFlow: defaultTypesFlow }, isOneComponentInFile);

    var propsAlias = _makeAlias.propsAlias;
    var defaultAlias = _makeAlias.defaultAlias;
    var defaultPropsName = _makeAlias.defaultPropsName;
    var propTypesName = _makeAlias.propTypesName;


    return {
        component: component,
        propsAlias: propsAlias,
        defaultAlias: defaultAlias,
        defaultPropsName: defaultPropsName,
        propTypesName: propTypesName,
        propsAnnotation: makeTypeAnnotation(j, propTypesName),
        defaultAnnotation: defaultAlias ? makeTypeAnnotation(j, defaultPropsName) : undefined
    };
}

function makeFlowComment(j, flowmode) {
    return j.commentBlock(' @' + flowmode + ' ');
}