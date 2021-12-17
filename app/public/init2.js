const getGlobal = function() {
  // eslint-disable-next-line no-undef
  if (typeof self !== 'undefined') { return self; }
  // eslint-disable-next-line no-undef
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
};
const _global = getGlobal();
if (typeof _global.globalThis === 'undefined') {
  _global.globalThis = _global;
}

{
  const COMMON_EVAL_FUNS = {
    时间间隔(date1, date2) {
      /**
       * @param date1 {Date|string (Date format)} 结束日期
       * @param date2 {Date|string (Date format)} 开始日期
       * @returns {null|*}
       */
      if (date1 && date2) {
        return ZY.Time.subtract2Date(date1, date2).asHours();
      }
      return null;
    },
    取整(v, presion) {
      /**
       * @param v
       * @param presion
       * @returns {string|*}
       */
      const ret = ZY.lodash.floor(v, presion);
      // if (ret === 0) {
      //   return ''
      // }
      return ret;
    },
  };
  // eslint-disable-next-line no-undef
  if (typeof globalThis.COM_FORM_COMMON_EVAL_FUNS === 'undefined') {
    // eslint-disable-next-line no-undef
    globalThis.COM_FORM_COMMON_EVAL_FUNS = COMMON_EVAL_FUNS;
  }

}

