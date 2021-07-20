/**
 * Time 库
 * @module Time
 */

import dayjs from 'dayjs';

/**
 * formatDateTime
 * @param date {Date}
 * @param format {string}
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs().format(format);
}
