import * as moment from 'moment';

/**
 *  Format moment to yyyy-MM-ddTHH:mm:ss.SSSZ format
 * @returns {string} formatted moment
 */
export const formatMoment = (): string =>
  moment()
    .format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    .replace(/(\+\d{2}):(\d{2})$/, '$1$2');

export function formatCurrency(number: number): string {
  return `${number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')} VNĐ`;
}
