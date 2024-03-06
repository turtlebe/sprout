import { useGlobalSnackbar } from '@plentyag/brand-ui/src/components';
import { useQueryParam } from '@plentyag/core/src/hooks';
import { getLuxonDateTime } from '@plentyag/core/src/utils';
import { useEffect } from 'react';
export interface UseProcessDateWindowReturn {
  startDate: Date;
  endDate: Date;
}

export const MAX_DAYS = 31;

/**
 * This will read and process the date filtering query params.  There is also a date window gaurd so we cannot query beyond 31 days
 * @returns {UseProcessDateWindowReturn}
 */
export const useProcessDateWindow = (): UseProcessDateWindowReturn => {
  const snackbar = useGlobalSnackbar();

  const queryParams = useQueryParam();
  const endDateTimeString = queryParams.get('endDateTime');
  const startDateTimeString = queryParams.get('startDateTime');

  // ---- get query start date or will default to today
  const endDateLuxon = getLuxonDateTime(endDateTimeString || new Date()).endOf('day');

  // ---- get query end date or just a month before start date
  const startDateLuxon = getLuxonDateTime(startDateTimeString || endDateLuxon.minus({ days: MAX_DAYS - 1 })).startOf(
    'day'
  ); // minus one to include the first day

  const isInvalidDateRange = Math.trunc(endDateLuxon.diff(startDateLuxon, 'days').as('days')) > MAX_DAYS - 1; // minus one to include the first day

  useEffect(() => {
    if (isInvalidDateRange) {
      snackbar.errorSnackbar({
        message: `This report is limited to ${MAX_DAYS} days at a time. Please change your date selection.`,
      });
    }
  }, [endDateTimeString, startDateTimeString, isInvalidDateRange]);

  return {
    startDate: isInvalidDateRange ? undefined : startDateLuxon.toJSDate(),
    endDate: isInvalidDateRange ? undefined : endDateLuxon.toJSDate(),
  };
};
