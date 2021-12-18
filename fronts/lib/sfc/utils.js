"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.no = function () { return false; };
exports.identity = function (x) { return x; };
function makeMap(str, expectsLowerCase) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var item = list_1[_i];
        map[item] = true;
    }
    return expectsLowerCase ? function (val) { return map[val.toLowerCase()]; } : function (val) { return map[val]; };
}
exports.makeMap = makeMap;
function equalsRecord(a, b) {
    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
        return false;
    }
    return aKeys.reduce(function (acc, key) {
        return acc && key in b && a[key] === b[key];
    }, true);
}
exports.equalsRecord = equalsRecord;
