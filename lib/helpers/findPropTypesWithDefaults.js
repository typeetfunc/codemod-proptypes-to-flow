'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findDynamicByName = exports.findStaticByName = exports.mergeByComponent = exports.isEqualComp = exports.findStaticAndDynamicWithComp = exports.findAnyByName = exports.classDeclarationFromProp = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = findTypesAndDefaults;

var _ramda = require('ramda');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function classDeclarationFromProp(path) {
  return path.parentPath.parentPath.parentPath;
}

function findStaticByName(j, node, name) {
  return node.find(j.ClassProperty, {
    key: {
      type: 'Identifier',
      name: name
    }
  });
}

function findDynamicByName(j, node, name) {
  return node.find(j.AssignmentExpression, {
    left: {
      property: {
        name: name
      }
    }
  });
}

function findAnyByName(j, node, name) {
  var id = { id: { name: name } };
  var any = [j.ClassDeclaration, j.FunctionDeclaration, j.VariableDeclarator].reduce(function (acc, type) {
    if (acc) {
      return acc;
    } else {
      var collect = node.find(type, id);
      return collect.size() ? collect.paths()[0] : null;
    }
  }, null);
  if (any && j.VariableDeclarator.check(any.node) && !j.ArrowFunctionExpression.check(any.node.init)) {
    return;
  }
  return any;
}

function findStaticAndDynamicWithComp(j, root, name) {
  var staticNodes = findStaticByName(j, root, name);
  var dynamicNodes = findDynamicByName(j, root, name);
  var nodes = staticNodes.paths().map(function (path) {
    return _defineProperty({
      component: classDeclarationFromProp(path)
    }, name, path.value.value);
  }).concat(dynamicNodes.paths().map(function (path) {
    return _defineProperty({
      component: findAnyByName(j, root, path.node.left.object.name)
    }, name, path.parentPath.value.expression.right);
  })).filter(function (_ref3) {
    var component = _ref3.component;
    return component;
  });
  return nodes;
}

function isEqualComp(comp1, comp2) {
  return comp1.node.id.name === comp2.node.id.name;
}

function mergeByComponent(list1, list2) {
  return list1.map(function (_ref4) {
    var comp = _ref4.component;

    var rest = _objectWithoutProperties(_ref4, ['component']);

    var finded = list2.find(function (_ref5) {
      var component = _ref5.component;
      return isEqualComp(component, comp);
    });
    return finded ? _extends({}, finded, rest) : _extends({ component: comp }, rest);
  });
}

var uniqByComponent = (0, _ramda.uniqBy)(function (_ref6) {
  var component = _ref6.component;
  return component;
});

function findTypesAndDefaults(j, root) {
  var propTypes = uniqByComponent(findStaticAndDynamicWithComp(j, root, 'propTypes'));
  var defaultProps = uniqByComponent(findStaticAndDynamicWithComp(j, root, 'defaultProps'));
  return mergeByComponent(propTypes, defaultProps);
}

exports.classDeclarationFromProp = classDeclarationFromProp;
exports.findAnyByName = findAnyByName;
exports.findStaticAndDynamicWithComp = findStaticAndDynamicWithComp;
exports.isEqualComp = isEqualComp;
exports.mergeByComponent = mergeByComponent;
exports.findStaticByName = findStaticByName;
exports.findDynamicByName = findDynamicByName;