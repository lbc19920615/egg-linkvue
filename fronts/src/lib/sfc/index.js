"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_mapvalues_1 = __importDefault(require("lodash.mapvalues"));
var sfc_parser_1 = require("./sfc-parser");
var diff_watcher_1 = require("./diff-watcher");
var utils_1 = require("./utils");
var SFCBlock = /** @class */ (function () {
    function SFCBlock(block) {
        var _this = this;
        Object.keys(block).forEach(function (_key) {
            var key = _key;
            _this[key] = block[key];
        });
    }
    SFCBlock.prototype.equals = function (block) {
        if (this === block) {
            return true;
        }
        return (this.type === block.type &&
            this.content === block.content &&
            this.start === block.start &&
            this.end === block.end &&
            this.lang === block.lang &&
            this.src === block.src &&
            this.scoped === block.scoped &&
            this.module === block.module &&
            utils_1.equalsRecord(this.attrs, block.attrs));
    };
    SFCBlock.prototype.calcGlobalOffset = function (offset) {
        return this.start + offset;
    };
    SFCBlock.prototype.calcGlobalRange = function (range) {
        return [this.calcGlobalOffset(range[0]), this.calcGlobalOffset(range[1])];
    };
    return SFCBlock;
}());
exports.SFCBlock = SFCBlock;
function parseComponent(code) {
    return lodash_mapvalues_1.default(sfc_parser_1.parseComponent(code), function (value, key) {
        if (Array.isArray(value)) {
            return value.map(function (v) { return new SFCBlock(v); });
        }
        else {
            return value && new SFCBlock(value);
        }
    });
}
exports.parseComponent = parseComponent;
function createDiffWatcher() {
    return new diff_watcher_1.SFCDiffWatcher();
}
exports.createDiffWatcher = createDiffWatcher;
