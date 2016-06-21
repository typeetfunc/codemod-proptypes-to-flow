'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createTypeAlias;
function createTypeAlias(j, flowTypes) {
  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$name = _ref.name;
  var name = _ref$name === undefined ? 'Props' : _ref$name;
  var _ref$shouldExport = _ref.shouldExport;
  var shouldExport = _ref$shouldExport === undefined ? false : _ref$shouldExport;

  var typeAlias = j.typeAlias(j.identifier(name), null, j.objectTypeAnnotation(flowTypes));

  if (shouldExport) {
    return j.exportNamedDeclaration(typeAlias);
  }

  return typeAlias;
}
module.exports = exports['default'];