const lodash = require('lodash');

function getStrIfIsNotEmpty(obj, path, defaultVal) {
  const v = lodash.get(obj, path);
  if (!v) {
    return defaultVal;
  }
  return v;
}

/**
 *
 * @param p
 * @param k
 */
function buildCls(p, k = 'ui.class') {
  const cls = lodash.get(p, k);
  let str = '';
  if (Array.isArray(cls)) {
    str = cls.join(' ');
  }
  return str;
}

/**
 * attrTOStr
 * @param attrs
 * @param context
 * @return {string}
 */
function attrTOStr(attrs = [], context = {}) {
  const c = Object.assign({
    $: lodash,
  }, context);
  let str = '';
  if (Array.isArray(attrs)) {
    attrs.forEach(attr => {
      if (Array.isArray(attr)) {
        str = str + ` ${attr[0]}='${attr[1]}'`;
      } else if (typeof attr === 'string') {
        str = str + ` ${attr}`;
      } else if (lodash.isObject(attr) && Array.isArray(attr.handler)) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(attr.handler[0], attr.handler[1]);
        const ret = fun(c);
        if (Array.isArray(ret)) {
          str = str + ` ${ret[0]}='${attr.prefixValue ? attr.prefixValue : ''}${ret[1]}${attr.suffixValue ? attr.suffixValue : ''}'`;
        }
      }
    });
    // console.log('attrs', attrs, str);
  }
  return str;
}

/**
 * attr2Str
 * @param attrs {Array}
 * @param context
 * @return {string}
 */
function attr2Str(attrs = [], context = {}) {
  const c = Object.assign({
    $: lodash,
  }, context);
  let str = '';
  if (Array.isArray(attrs)) {
    attrs.forEach(attr => {
      if (Array.isArray(attr)) {
        str = str + ` ${attr[0]}='${attr[1]}'`;
      } else if (typeof attr === 'string') {
        str = str + ` ${attr}`;
      } else if (lodash.isObject(attr) && Array.isArray(attr.handler)) {
        // eslint-disable-next-line no-new-func
        const fun = new Function(attr.handler[0], attr.handler[1]);
        const ret = fun(c);
        if (Array.isArray(ret)) {
          str = str + ` ${ret[0]}='${attr.prefixValue ? attr.prefixValue : ''}${ret[1]}${attr.suffixValue ? attr.suffixValue : ''}'`;
        }
      }
    });
    // console.log('attrs', attrs, str);
  }
  return str.trim();
}

module.exports = {
  attr2Str,
  getStrIfIsNotEmpty,
  buildCls,
  attrTOStr,
};
