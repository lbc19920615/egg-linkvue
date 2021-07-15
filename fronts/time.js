import dayjs from 'dayjs';

/**
 * @param date {Date}
 * @param format {string}
 */
export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs().format(format);
}
