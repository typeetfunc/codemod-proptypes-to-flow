'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var _fixMeType = require('./fixMeType');

var _fixMeType2 = _interopRequireDefault(_fixMeType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MATCH_THIS = {
    computed: false,
    object: {
        type: 'ThisExpression'
    }
};
var makeBlacklist = (0, _ramda.compose)(_ramda.uniq, (0, _ramda.concat)(['props', 'context']));
var notInBlacklist = function notInBlacklist(list) {
    return function (val) {
        return !(0, _ramda.contains)(val, list);
    };
};
var uniqByName = (0, _ramda.uniqBy)((0, _ramda.prop)('name'));

exports.default = function (j, classComp) {
    var declared = classComp.node.body.body.map(function (propOrMethod) {
        return propOrMethod.key.name;
    });
    var blacklist = makeBlacklist(declared);
    var checker = notInBlacklist(blacklist);

    return uniqByName(j(classComp).find(j.MemberExpression, MATCH_THIS).paths().filter(function (expr) {
        return checker(expr.value.property.name);
    }).map(function (expr) {
        return {
            name: expr.value.property.name,
            annotation: j.CallExpression.check(expr.parent.node) ? j.typeAnnotation(j.genericTypeAnnotation(j.identifier('Function'), null)) : j.typeAnnotation((0, _fixMeType2.default)(j))
        };
    }));
};

module.exports = exports['default'];