'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = annotationsToFile;

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _annotationsToPartComponent = require('./annotationsToPartComponent');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function annotationsToFile(j, filePath, annotations, flowmode) {
    var dir = path.dirname(filePath);
    var importFileName = path.basename(filePath).replace(/(\.\w+?)$/, '.flow$1');
    var importFilePath = path.format({
        dir: dir,
        base: importFileName
    });
    var importNode = j.importDeclaration(annotations.reduce(function (acc, _ref) {
        var defaultPropsName = _ref.defaultPropsName;
        var propTypesName = _ref.propTypesName;
        return [].concat(_toConsumableArray(acc), [j.importSpecifier(j.identifier(propTypesName))], _toConsumableArray(defaultPropsName ? [j.importSpecifier(j.identifier(defaultPropsName))] : []));
    }, []), j.literal(path.format({
        dir: '.',
        base: importFileName
    })));
    importNode.importKind = 'type';
    var body = annotations.reduce(function (acc, _ref2) {
        var propsAlias = _ref2.propsAlias;
        var defaultAlias = _ref2.defaultAlias;
        return [].concat(_toConsumableArray(acc), [j.exportNamedDeclaration(propsAlias)], _toConsumableArray(defaultAlias ? [j.exportNamedDeclaration(defaultAlias)] : []));
    }, []);
    var program = j.program([j.importDeclaration([j.importDefaultSpecifier(j.identifier('React'))], j.literal('react'))].concat(_toConsumableArray(body)));
    if (flowmode) {
        program.comments = [(0, _annotationsToPartComponent.makeFlowComment)(j, flowmode)];
    }

    return {
        programNode: j(program),
        importNode: importNode,
        path: importFilePath
    };
}
module.exports = exports['default'];