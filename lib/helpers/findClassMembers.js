'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _ramda = require('ramda');

var MATCH_THIS = {
    computed: false,
    object: {
        type: 'ThisExpression'
    }
};
var makeBlacklist = (0, _ramda.compose)(_ramda.uniq, (0, _ramda.append)('props'), _ramda.concat);
var notInBlacklist = function notInBlacklist(list) {
    return function (val) {
        return !(0, _ramda.contains)(val, list);
    };
};

exports.default = function (j, classComp) {
    var classCollection = j(classComp);

    var methods = classCollection.find(j.MethodDefinition).paths().map(function (expr) {
        return expr.value.key.name;
    });
    var calls = classCollection.find(j.CallExpression, {
        callee: MATCH_THIS
    }).paths().map(function (expr) {
        return expr.value.callee.property.name;
    });
    var blacklist = makeBlacklist(methods, calls);

    return (0, _ramda.uniq)(j(classComp).find(j.MemberExpression, MATCH_THIS).paths().map(function (expr) {
        return expr.value.property.name;
    }).filter(notInBlacklist(blacklist)));
};

module.exports = exports['default'];