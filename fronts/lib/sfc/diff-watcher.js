"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// var assert = require("assert");
var index_1 = require("./index");
var SFCDiffWatcher = /** @class */ (function () {
    function SFCDiffWatcher() {
        this.prevMap = {};
    }
    SFCDiffWatcher.prototype.add = function (filename, content) {
        return (this.prevMap[filename] = index_1.parseComponent(content));
    };
    SFCDiffWatcher.prototype.remove = function (filename) {
        delete this.prevMap[filename];
    };
    SFCDiffWatcher.prototype.diff = function (filename, content) {
        // assert(this.prevMap.hasOwnProperty(filename), 'must call `add` before calling `diff`');
        var prev = this.prevMap[filename];
        var curr = (this.prevMap[filename] = index_1.parseComponent(content));
        return new SFCDiff(prev, curr);
    };
    return SFCDiffWatcher;
}());
exports.SFCDiffWatcher = SFCDiffWatcher;
var SFCDiff = /** @class */ (function () {
    function SFCDiff(prev, curr) {
        this.prev = prev;
        this.curr = curr;
    }
    SFCDiff.prototype.template = function (cb) {
        var prev = this.prev.template;
        var curr = this.curr.template;
        if (this.hasDiff(prev, curr)) {
            cb(curr);
        }
        return this;
    };
    SFCDiff.prototype.script = function (cb) {
        var prev = this.prev.script;
        var curr = this.curr.script;
        if (this.hasDiff(prev, curr)) {
            cb(curr);
        }
        return this;
    };
    SFCDiff.prototype.styles = function (cb) {
        var prev = this.prev.styles;
        var curr = this.curr.styles;
        if (this.hasListDiff(prev, curr)) {
            cb(curr);
        }
        return this;
    };
    SFCDiff.prototype.customBlocks = function (name, cb) {
        var prev = this.prev.customBlocks;
        var curr = this.curr.customBlocks;
        if (this.hasListDiff(prev, curr)) {
            cb(curr);
        }
        return this;
    };
    SFCDiff.prototype.hasDiff = function (prev, curr) {
        if (prev === null || curr === null) {
            return prev !== curr;
        }
        return !prev.equals(curr);
    };
    SFCDiff.prototype.hasListDiff = function (prev, curr) {
        var _this = this;
        if (prev.length !== curr.length) {
            return true;
        }
        return prev.reduce(function (acc, p, i) {
            return acc && _this.hasDiff(p, curr[i]);
        }, true);
    };
    return SFCDiff;
}());
exports.SFCDiff = SFCDiff;
