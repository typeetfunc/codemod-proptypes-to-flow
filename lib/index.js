'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = transformer;

var _findPropTypesWithDefaults = require('./helpers/findPropTypesWithDefaults');

var _findPropTypesWithDefaults2 = _interopRequireDefault(_findPropTypesWithDefaults);

var _propTypesWithDefaultsToFlow = require('./helpers/propTypesWithDefaultsToFlow');

var _propTypesWithDefaultsToFlow2 = _interopRequireDefault(_propTypesWithDefaultsToFlow);

var _setAnnotations = require('./helpers/setAnnotations');

var _annotationsToPartComponent = require('./helpers/annotationsToPartComponent');

var _annotationsToPartComponent2 = _interopRequireDefault(_annotationsToPartComponent);

var _annotationsToFile = require('./helpers/annotationsToFile');

var _annotationsToFile2 = _interopRequireDefault(_annotationsToFile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var DEFAULT_OPTIONS = {
    annotationToFile: false,
    generate: {
        quote: 'single'
    },
    removePropTypes: false
};

function transformer(file, api, options) {
    var j = api.jscodeshift;
    var config = _extends({}, DEFAULT_OPTIONS, options);
    var _j$template = j.template;
    var expression = _j$template.expression;
    var statement = _j$template.statement;
    var statements = _j$template.statements;

    var root = j(file.source);
    var typeWithDefault = (0, _findPropTypesWithDefaults2.default)(j, root);
    if (typeWithDefault.length === 0) {
        return;
    }
    var withAnnotations = (0, _propTypesWithDefaultsToFlow2.default)(j, typeWithDefault);
    var withAnnotationsInPart = withAnnotations.map(function (component) {
        return (0, _annotationsToPartComponent2.default)(j, component, withAnnotations.length === 1);
    });

    var exportFile = void 0;
    if (options.annotationToFile) {
        exportFile = (0, _annotationsToFile2.default)(j, file.path, withAnnotationsInPart, config.setFlowMode);
        (0, _setAnnotations.setImportToFile)(j, root, exportFile.importNode);
    } else {
        (0, _setAnnotations.setTypeAlias)(j, root, withAnnotationsInPart.reduce(function (acc, _ref) {
            var propsAlias = _ref.propsAlias;
            var defaultAlias = _ref.defaultAlias;
            return [].concat(_toConsumableArray(acc), [propsAlias], _toConsumableArray(defaultAlias ? [defaultAlias] : []));
        }, []));
    }
    withAnnotationsInPart.forEach(function (compWithAnnotation) {
        return (0, _setAnnotations.setToComponent)(j, compWithAnnotation);
    });
    if (config.removePropTypes) {
        (0, _setAnnotations.removePropTypes)(j, root);
    }
    if (config.setFlowMode) {
        (0, _setAnnotations.setFlowMode)(j, root, config.setFlowMode);
    }
    return exportFile ? [root.toSource(config.generate), { path: exportFile.path, source: exportFile.programNode.toSource(config.generate) }] : root.toSource(config.generate);
}
module.exports = exports['default'];