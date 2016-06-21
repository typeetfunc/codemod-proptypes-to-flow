'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformer;

var _transformProperties = require('./helpers/transformProperties');

var _transformProperties2 = _interopRequireDefault(_transformProperties);

var _createTypeAlias = require('./helpers/createTypeAlias.js');

var _createTypeAlias2 = _interopRequireDefault(_createTypeAlias);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api) {
  var j = api.jscodeshift;
  var _j$template = j.template;
  var expression = _j$template.expression;
  var statement = _j$template.statement;
  var statements = _j$template.statements;

  var flowTypes = void 0;
  var root = j(file.source);

  return root.find(j.VariableDeclaration).replaceWith(function (p) {
    var flowTypes = (0, _transformProperties2.default)(j, p.value.declarations[0].init.properties);
    return (0, _createTypeAlias2.default)(j, flowTypes);
  }).toSource();
};
module.exports = exports['default'];