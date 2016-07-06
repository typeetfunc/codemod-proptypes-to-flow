'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isEqualObjectExprKey = isEqualObjectExprKey;
exports.default = propTypesWithDefaultsToFlow;

var _propTypeToFlowType = require('./propTypeToFlowType');

var _propTypeToFlowType2 = _interopRequireDefault(_propTypeToFlowType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isEqualObjectExprKey(key1, key2) {
  return (key1.name || key1.value) === (key2.name || key2.value);
}

function propTypesWithDefaultsToFlow(j, propTypesWithDefaults) {
  return propTypesWithDefaults.map(function (_ref) {
    var component = _ref.component;
    var propTypes = _ref.propTypes;
    var defaultProps = _ref.defaultProps;

    var annotations = propTypes.properties.map(function (prop) {
      var t = (0, _propTypeToFlowType2.default)(j, prop.key, prop.value);
      t.comments = prop.comments;
      return t;
    });
    if (defaultProps && defaultProps.properties.length) {
      var defaultAnnotations = defaultProps.properties.map(function (prop) {
        return annotations.find(function (_ref2) {
          var key = _ref2.key;
          return isEqualObjectExprKey(key, prop.key);
        });
      }).filter(function (val) {
        return val;
      });
      return { component: component, propTypes: propTypes, propTypesFlow: annotations, defaultTypesFlow: defaultAnnotations };
    } else {
      return { component: component, propTypes: propTypes, propTypesFlow: annotations };
    }
  });
}