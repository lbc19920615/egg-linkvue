/**
 * Time 库
 * @module Time
 */

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

/**
 * formatDateTime
 * @param date {Date}
 * @param format {string}
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs().format(format);
}

/**
 * subtract2Date
 * @param date1
 * @param date2
 * @return {plugin.Duration}
 */
export function subtract2Date(date1, date2) {
  const x = dayjs(date1);
  const y = dayjs(date2);
  const duration = dayjs.duration(x.diff(y));
  return duration;
}
