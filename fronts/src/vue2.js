/**
 * Vue ext模组.
 * @module vue2
 */

import _eval5 from 'eval5';
/**
 * eval5 执行js string代码
 * eval5官网 {@link https://www.npmjs.com/package/eval5}
 */
export const eval5 = _eval5;

/**
 * {ResizeObserver, ResizeObserverEntry, ResizeObserverSize}
 * 检测HTML元素的size改变
 */
import * as Lib from '@juggle/resize-observer';
export const ResizeObserver = Lib.ResizeObserver;

/**
 * mitt 事件emitter管理
 */
import _mitt from 'mitt';
export const mitt = _mitt;


/**
 * sfc 解析组件
 */
import sfc from './lib/sfc';
export const parseComponent = sfc.parseComponent;

/**
 * cssobj 用于生成css
 */
import _cssobj from 'cssobj';
export const cssobj = _cssobj;

/**
 * 比较版本号大小 兼容微信版本号
 * -1 v1 版本小于 v2   0 相等
 * @param v1
 * @param v2
 * @return {number}
 */
export function compareLibVersion(v1, v2) {
  v1 = v1.split('.');
  v2 = v2.split('.');
  const len = Math.max(v1.length, v2.length);
  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }
  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i]);
    const num2 = parseInt(v2[i]);
    if (num1 > num2) {
      return 1;
    } else if (num1 < num2) {
      return -1;
    }
  }
  return 0;
}

/**
 * 数据对象的结构化clone
 * https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
 */
import _structuredClone from '@ungap/structured-clone';
export const structuredClone = _structuredClone;
