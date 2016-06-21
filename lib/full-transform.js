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

  var classNames = [];

  // find classes
  root = root.find(j.ClassDeclaration).forEach(function (p) {
    // find classes with propType static class property

    var properties = void 0;
    if (p.value.body && p.value.body.body) {
      (0, _annotateConstructor2.default)(j, p.value.body.body);
      var index = (0, _findIndex2.default)(p.value.body.body, isStaticPropType);
      if (typeof index !== 'undefined') {
        var classProperty = p.value.body.body.splice(index, 1).pop();
        properties = classProperty.value.properties;
      } else {
        // look for propTypes defined elsewhere
        var className = p.value.id;
        classNames.push(className.name);

        j(file.source).find(j.AssignmentExpression, {
          left: {
            type: 'MemberExpression',
            object: {
              name: className.name
            },
            property: {
              name: 'propTypes'
            }
          },
          right: {
            type: 'ObjectExpression'
          }
        }).forEach(function (p) {
          // this should only be one?
          properties = p.value.right.properties;
        }).replaceWith(function (p) {
          return '';
        });
      }

      if (properties) {
        var _ret = function () {
          var typeAlias = (0, _createTypeAlias2.default)(j, (0, _transformProperties2.default)(j, properties), {
            shouldExport: true
          });

          // Find location to put propTypes flowtype definition
          // This will place ahead of class def

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
  }).toSource();

  return j(root).find(j.ExpressionStatement, {
    expression: {
      type: 'AssignmentExpression',
      left: {
        type: 'MemberExpression',
        property: {
          name: 'propTypes'
        }
      },
      right: {
        type: 'ObjectExpression'
      }
    }
  }).filter(function (p) {
    return classNames.indexOf(p.value.expression.left.object.name) > -1;
  }).replaceWith(function (p) {
    return '';
  }).toSource();
};
module.exports = exports['default'];