'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _transformProperties = require('./helpers/transformProperties');

var _transformProperties2 = _interopRequireDefault(_transformProperties);

var _createTypeAlias = require('./helpers/createTypeAlias');

var _createTypeAlias2 = _interopRequireDefault(_createTypeAlias);

var _findParentBody = require('./helpers/findParentBody');

var _findParentBody2 = _interopRequireDefault(_findParentBody);

var _annotateConstructor = require('./helpers/annotateConstructor');

var _annotateConstructor2 = _interopRequireDefault(_annotateConstructor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api) {
  var j = api.jscodeshift;
  var _j$template = j.template;
  var expression = _j$template.expression;
  var statement = _j$template.statement;
  var statements = _j$template.statements;


  var root = j(file.source);

  // find classes
  return root.find(j.ClassDeclaration).forEach(function (p) {
    // find classes with propType static class property
    if (p.value.body && p.value.body.body) {
      (0, _annotateConstructor2.default)(j, p.value.body.body);
    }
  }).map(function (p) {
    return p;
  }).toSource();
};
module.exports = exports['default'];