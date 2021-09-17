/**
 * Time 库
 * @module Time
 */

import _dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

_dayjs.extend(duration);

/**
 * dayjs
 */
export const dayjs = _dayjs;

/**
 * formatDateTime
 * @param date {Date}
 * @param format {string}
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return _dayjs(date).format(format);
}

/**
 * subtract2Date
 * @param date1
 * @param date2
 * @return {plugin.Duration}
 */
export function subtract2Date(date1, date2) {
  const x = _dayjs(date1);
  const y = _dayjs(date2);
  const duration = _dayjs.duration(x.diff(y));
  return duration;
}
