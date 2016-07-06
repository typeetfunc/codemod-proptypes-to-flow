'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.setImportToFile = setImportToFile;
exports.setTypeAlias = setTypeAlias;
exports.createProperty = createProperty;
exports.isDefaultProps = isDefaultProps;
exports.setFlowMode = setFlowMode;
exports.setToComponent = setToComponent;
exports.removePropTypes = removePropTypes;

var _findPropTypesWithDefaults = require('./findPropTypesWithDefaults');

var _annotationsToPartComponent = require('./annotationsToPartComponent');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function getProgramFile(file) {
    return file.paths()[0].value.program;
}

function setAfterLastImport(j, file) {
    var _program$body;

    var program = getProgramFile(file);
    var importIdxs = program.body.map(function (node, i) {
        return [node, i];
    }).filter(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var node = _ref2[0];
        var i = _ref2[1];
        return j.ImportDeclaration.check(node);
    }).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2);

        var node = _ref4[0];
        var i = _ref4[1];
        return i;
    });
    var lastIdx = importIdxs.length > 0 ? importIdxs[importIdxs.length - 1] + 1 : 0;

    for (var _len = arguments.length, nodes = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        nodes[_key - 2] = arguments[_key];
    }

    (_program$body = program.body).splice.apply(_program$body, [lastIdx, 0].concat(nodes));
}

function setImportToFile(j, file, importNode) {
    setAfterLastImport(j, file, importNode);
}

function setTypeAlias(j, file, aliases) {
    setAfterLastImport.apply(undefined, [j, file].concat(_toConsumableArray(aliases)));
}

function createProperty(j, name, annotation) {
    var isStatic = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

    return j.classProperty(j.identifier(name), null, annotation, isStatic);
}

function isDefaultProps(j, node) {
    return j.ClassProperty.check(node) && node.static && node.key.name === 'defaultProps';
}

function setFlowMode(j, file, mode) {
    getProgramFile(file).comments = [(0, _annotationsToPartComponent.makeFlowComment)(j, mode)].concat(_toConsumableArray(getProgramFile(file).comments || []));
}

function setToComponent(j, _ref5) {
    var component = _ref5.component;
    var propsAnnotation = _ref5.propsAnnotation;
    var defaultAnnotation = _ref5.defaultAnnotation;

    if (j.ClassDeclaration.check(component.node)) {
        var body = component.node.body.body;
        var defaultProps = defaultAnnotation && body.find(function (prop) {
            return isDefaultProps(j, prop);
        });
        if (defaultAnnotation) {
            if (defaultProps) {
                defaultProps.typeAnnotation = defaultAnnotation;
            } else {
                body.unshift(createProperty(j, 'defaultProps', defaultAnnotation, true));
            }
        }
        body.unshift(createProperty(j, 'props', propsAnnotation));
    } else if (j.FunctionDeclaration.check(component.node)) {
        if (component.node.params[0]) {
            component.node.params[0].typeAnnotation = propsAnnotation;
        }
    } else if (j.VariableDeclarator.check(component.node)) {
        if (component.node.init.params[0]) {
            component.node.init.params[0].typeAnnotation = propsAnnotation;
        }
    }
}

function removePropTypes(j, file) {
    (0, _findPropTypesWithDefaults.findStaticByName)(j, file, 'propTypes').remove();
    (0, _findPropTypesWithDefaults.findDynamicByName)(j, file, 'propTypes').remove();
}