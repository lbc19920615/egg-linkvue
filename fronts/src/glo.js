import * as _time from './time';
import floor from 'lodash/floor';

export const _COM_FORM_COMMON_EVAL_FUNS = {
  时间间隔(date1, date2) {
    /**
     * @param date1 {Date|string (Date format)} 结束日期
     * @param date2 {Date|string (Date format)} 开始日期
     * @returns {null|*}
     */
    if (date1 && date2) {
      return _time.subtract2Date(date1, date2).asHours();
    }
    return null;
  },
  取整(v, presion) {
    /**
     * @param v
     * @param presion
     * @returns {string|*}
     */
    const ret = floor(v, presion);
    // if (ret === 0) {
    //   return ''
    // }
    return ret;
  },
};
