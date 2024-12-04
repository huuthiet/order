import * as moment from 'moment';

/**
 *  Format moment to yyyy-MM-ddTHH:mm:ss.SSSZ format
 * @returns {string} formatted moment
 */
export const formatMoment = (): string =>
  moment()
    .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    .replace(/(\+\d{2}):(\d{2})$/, '$1$2');

/**
 * Format number to currency
 * @param {number} number
 * @returns {string} formatted currency
 */
export function formatCurrency(number: number): string {
  return `${number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} VNĐ`;
}

/**
 * Get the day index (0 = Monday, 1 = Tuesday, etc.)
 * @param {Date} date
 * @returns {number} day index
 */
export const getDayIndex = (date: Date): number => {
  const startOfWeek = moment(date).startOf('isoWeek'); // Monday of the week for the target date
  return moment(date).diff(startOfWeek, 'days'); // Get the day index (0 = Monday, 1 = Tuesday, etc.)
};
