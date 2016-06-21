'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = transformer;

var _transformProperties = require('./helpers/transformProperties');

var _transformProperties2 = _interopRequireDefault(_transformProperties);

var _createTypeAlias = require('./helpers/createTypeAlias');

var _createTypeAlias2 = _interopRequireDefault(_createTypeAlias);

var _findParentBody2 = require('./helpers/findParentBody');

var _findParentBody3 = _interopRequireDefault(_findParentBody2);

var _annotateConstructor = require('./helpers/annotateConstructor');

var _annotateConstructor2 = _interopRequireDefault(_annotateConstructor);

var _findIndex = require('./helpers/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api) {
  var j = api.jscodeshift;
  var _j$template = j.template;
  var expression = _j$template.expression;
  var statement = _j$template.statement;
  var statements = _j$template.statements;


  var root = j(file.source);

  var isStaticPropType = function isStaticPropType(p) {
    return p.type === 'ClassProperty' && p.static && p.key.type === 'Identifier' && p.key.name === 'propTypes';
  };

  // find classes
  return root.find(j.ClassDeclaration).forEach(function (p) {
    // find classes with propType static class property
    if (p.value.body && p.value.body.body) {
      var index = (0, _findIndex2.default)(p.value.body.body, isStaticPropType);
      if (typeof index !== 'undefined') {
        var _ret = function () {
          var classProperty = p.value.body.body.splice(index, 1).pop();
          var typeAlias = (0, _createTypeAlias2.default)(j, (0, _transformProperties2.default)(j, classProperty.value.properties), {
            shouldExport: true
          });

          // find parent

          var _findParentBody = (0, _findParentBody3.default)(p);

          var child = _findParentBody.child;
          var body = _findParentBody.body;

          if (body && child) {
            var bodyIndex = (0, _findIndex2.default)(body.value, function (b) {
              return b === child;
            });
            if (bodyIndex) {
              body.value.splice(bodyIndex, 0, typeAlias);
            }
          }
          return {
            v: p
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }
  }).map(function (p) {
    return p;
  }).toSource();
};
module.exports = exports['default'];