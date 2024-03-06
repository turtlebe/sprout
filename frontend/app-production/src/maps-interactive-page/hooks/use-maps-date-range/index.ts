import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { DAYS_PER_AREA } from '../../constants';
import { SupportedAreaClass } from '../../types';

export interface UseMapsDateRange {
  startDate: string;
  endDate: string;
}

/**
 * There can be times that a container stays within the room longer than it should have,
 * so we need to widen the range to capture all the data possible.  This is not an optimal
 * solution since there can be further exceptions, but the reason for the range is to
 * minimize the dataset.  Further BE optimizations are pending.
 */
const EXTENDED_RANGE_BUFFER = 10;

export const useMapsDateRange = (
  site: string,
  areaClass: SupportedAreaClass,
  selectedDate: DateTime
): UseMapsDateRange => {
  const dates = useMemo(() => {
    if (!site || !areaClass || !selectedDate) {
      return {
        startDate: null,
        endDate: null,
      };
    }

    const daysInThisArea = DAYS_PER_AREA[site][areaClass];
    return {
      startDate: selectedDate
        .startOf('day')
        .minus({ days: daysInThisArea + EXTENDED_RANGE_BUFFER })
        .toISO(),
      endDate: selectedDate.endOf('day').toISO(),
    };
  }, [site, areaClass, selectedDate]);

  return dates;
};
