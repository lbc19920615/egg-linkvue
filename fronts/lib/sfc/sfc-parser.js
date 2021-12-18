"use strict";
/*!
 * Vue SFC Parser
 * Copyright (c) Evan You
 * MIT License
 * Original code is from https://github.com/vuejs/vue
 */
Object.defineProperty(exports, "__esModule", { value: true });
var html_parser_1 = require("./html-parser");
var utils_1 = require("./utils");
var splitRE = /\r?\n/g;
var replaceRE = /./g;
var isSpecialTag = utils_1.makeMap('script,style,template', true);
/**
 * Parse a single-file component (*.vue) file into an SFC Descriptor Object.
 */
function parseComponent(content, options) {
    if (options === void 0) { options = {}; }
    var sfc = {
        template: null,
        script: null,
        styles: [],
        customBlocks: []
    };
    var depth = 0;
    var currentBlock = null;
    function start(tag, attrs, unary, start, end) {
        if (depth === 0) {
            currentBlock = {
                type: tag,
                content: '',
                start: end,
                end: end,
                attrs: attrs.reduce(function (cumulated, _a) {
                    var name = _a.name, value = _a.value;
                    cumulated[name] = value || true;
                    return cumulated;
                }, {})
            };
            if (isSpecialTag(tag)) {
                checkAttrs(currentBlock, attrs);
                if (tag === 'style') {
                    sfc.styles.push(currentBlock);
                }
                else {
                    sfc[tag] = currentBlock;
                }
            }
            else {
                // custom blocks
                sfc.customBlocks.push(currentBlock);
            }
        }
        if (!unary) {
            depth++;
        }
    }
    function checkAttrs(block, attrs) {
        for (var _i = 0, attrs_1 = attrs; _i < attrs_1.length; _i++) {
            var attr = attrs_1[_i];
            if (attr.name === 'lang') {
                block.lang = attr.value;
            }
            if (attr.name === 'scoped') {
                block.scoped = true;
            }
            if (attr.name === 'module') {
                block.module = attr.value || true;
            }
            if (attr.name === 'src') {
                block.src = attr.value;
            }
        }
    }
    function end(tag, start, end) {
        if (depth === 1 && currentBlock) {
            currentBlock.end = start;
            currentBlock.content = content.slice(currentBlock.start, currentBlock.end);
            currentBlock = null;
        }
        depth--;
    }
    html_parser_1.parseHTML(content, {
        start: start,
        end: end
    });
    return sfc;
}
exports.parseComponent = parseComponent;
