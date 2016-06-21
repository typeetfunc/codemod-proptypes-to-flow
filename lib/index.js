'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = transformer;

var _propTypeToFlowType = require('./helpers/propTypeToFlowType');

var _propTypeToFlowType2 = _interopRequireDefault(_propTypeToFlowType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformer(file, api) {
  var j = api.jscodeshift;
  var _j$template = j.template;
  var expression = _j$template.expression;
  var statement = _j$template.statement;
  var statements = _j$template.statements;

  console.log(file);
  var root = j(file.source);
  var requiredProps = new Set();
  var hasStaticProps = void 0;

  var nonStaticQuery = void 0;
  var staticPropsQuery = root.find(j.ClassProperty, {
    key: {
      type: 'Identifier',
      name: 'propTypes'
    }
  });

  hasStaticProps = staticPropsQuery.size();
  if (hasStaticProps) {
    // Replace React.PropTypes
    root = staticPropsQuery.replaceWith(function (p) {
      if (p && p.value && p.value.value) {
        j(p.value.value).find(j.MemberExpression, {
          property: {
            type: 'Identifier',
            name: 'isRequired'
          }
        }).replaceWith(function (p) {
          requiredProps.add(p.parentPath.value.key.name);

          return p.value.object;
        }).toSource();
        p.value.value.properties.map(function (prop) {
          return j(prop).find(j.MemberExpression, {
            object: {
              type: 'Identifier',
              name: 'React'
            },
            property: {
              type: 'Identifier',
              name: 'PropTypes'
            }
          }).replaceWith(function (p) {
            return p.value.property;
          });
          return prop;
        });
      }
      return p.value;
    }).toSource();
  } else {

    nonStaticQuery = j(file.source).find(j.AssignmentExpression, {
      left: {
        property: {
          name: 'propTypes'
        }
      }
    });

    root = nonStaticQuery.replaceWith(function (p) {
      if (p && p.value && p.value.right) {
        j(p.value.right.properties).find(j.MemberExpression, {
          property: {
            type: 'Identifier',
            name: 'isRequired'
          }
        }).replaceWith(function (p) {
          requiredProps.add(p.parentPath.value.key.name);

          return p.value.object;
        }).toSource();
        p.value.right.properties.map(function (prop) {
          return j(prop).find(j.MemberExpression, {
            object: {
              type: 'Identifier',
              name: 'React'
            },
            property: {
              type: 'Identifier',
              name: 'PropTypes'
            }
          }).replaceWith(function (p) {
            return p.value.property;
          });
          return prop;
        });
      }
      return p.value;
    }).toSource();
  }

  // Look for propTypes

  var flowTypes = void 0;
  var query = hasStaticProps ? j(root).find(j.ClassProperty, {
    key: {
      name: 'propTypes'
    }
  }) : j(root).find(j.AssignmentExpression, {
    left: {
      property: {
        name: 'propTypes'
      }
    }
  });

  root = query.forEach(function (p) {
    var properties = hasStaticProps ? p.value.value.properties : p.value.right.properties;

    flowTypes = properties.map(function (property) {
      //console.log(findPropType(property.value));
      //console.log(property, j(property).find(j.Identifier).map(p => console.log(p)))//, p.parent.parent.value.property)));
      var optional = !requiredProps.has(property.key.name);
      var t = (0, _propTypeToFlowType2.default)(j, property.key, property.value);
      t.comments = property.comments;
      return t;
    });
  }).replaceWith(function (p) {
    return '';
  }).toSource();

  if (flowTypes) {
    var _ret = function () {
      var flowTypeProps = j.exportNamedDeclaration(j.typeAlias(j.identifier('Props'), null, j.objectTypeAnnotation(flowTypes)));

      return {
        v: j(root).forEach(function (p) {
          var index = void 0;
          p.value.program.body.filter(function (p, i) {
            var found = void 0;
            var classExpression = j(p).find(j.ClassDeclaration);
            if (classExpression.size()) {
              index = i;
              found = classExpression;
            } else {
              if (p.type === 'ClassDeclaration') {
                index = i;
                found = p;
              }
            }
            var propTypeAnnotationIndex = 0;

            if (found) {
              // found our class declaration, lets find constructor
              found.body.body.some(function (b, i) {
                if (b.kind === 'constructor') {
                  propTypeAnnotationIndex = i + 1;
                  b.value.params.forEach(function (param) {
                    if (param.name === 'props') {
                      param.typeAnnotation = j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Props'), null));
                    }
                  });
                  return true;
                }
              });
              found.body.body.splice(propTypeAnnotationIndex, 0, j.classProperty(j.identifier('props'), null, j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Props'), null))));
            }
            return found;
          });
          p.value.program.body.splice(index, 0, flowTypeProps);
        }).toSource({ quote: 'single', trailingComma: true })
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } else {
    return j(root).toSource({ quote: 'single' });
  }
};
module.exports = exports['default'];