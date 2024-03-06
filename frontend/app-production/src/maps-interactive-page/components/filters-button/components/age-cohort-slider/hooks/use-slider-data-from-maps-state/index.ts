import { AgeCohortDate, MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { getResourceLoadedDate } from '@plentyag/app-production/src/maps-interactive-page/utils/get-resource-loaded-date';
import { Mark } from '@plentyag/brand-ui/src/material-ui/core';
import { orderBy } from 'lodash';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

import { DEFAULT_ALL, DEFAULT_ALL_RECORD } from '../../constants';
import { AgeCohorSliderChange } from '../../types';

export const useSliderDataFromMapsState = (
  mapsState: MapsState,
  selectedDate: DateTime,
  selectedAgeCohortDate?: AgeCohortDate
) => {
  // Figure out the data
  const { marks, marksRecord } = useMemo(
    () =>
      Object.values(mapsState || {}).reduce<{
        marks: Mark[];
        marksRecord: Record<number, AgeCohorSliderChange>;
      }>(
        (agg, resource) => {
          const resourceLoadedDate = getResourceLoadedDate(resource);
          const resourceLoadedDateLuxon = resourceLoadedDate && DateTime.fromJSDate(resourceLoadedDate);

          if (!resourceLoadedDateLuxon) {
            return agg;
          }

          const { marks, marksRecord } = agg;
          const value = Math.trunc(selectedDate.endOf('day').diff(resourceLoadedDateLuxon, 'days').as('days'));

          if (!marks.find(item => marksRecord[item.value.toString()].value === value)) {
            const shortLabel =
              value > DEFAULT_ALL.value ? (value === 0 ? 'Today' : `${value}`) : DEFAULT_ALL_RECORD.shortLabel;

            const label =
              value > DEFAULT_ALL.value ? (value === 0 ? 'Today' : `Day ${value}`) : DEFAULT_ALL_RECORD.label;

            marksRecord[value.toString()] = {
              ageCohortDate: resourceLoadedDateLuxon
                ? resourceLoadedDateLuxon.toJSDate()
                : DEFAULT_ALL_RECORD.ageCohortDate,
              value,
              label,
              shortLabel,
            };

            marks.push({
              value,
              label: shortLabel,
            });
          }

          return agg;
        },
        {
          marks: [DEFAULT_ALL],
          marksRecord: { [`${DEFAULT_ALL.value}`]: DEFAULT_ALL_RECORD },
        }
      ),
    [mapsState, selectedDate]
  );

  // Sort all the marks by value
  const sortedMarks = orderBy(marks, 'value');

  // Only show the first mark and last label skipping the first "all" record
  const filteredMarks = sortedMarks.slice(1).map((sortedMark, index, arr) => {
    const isFirstOrLast = index === 0 || index === arr.length - 1;
    return {
      ...sortedMark,
      label: isFirstOrLast ? sortedMark.label : undefined,
    };
  });

  // Find the selected record
  const selectedMarksRecord =
    selectedAgeCohortDate &&
    selectedAgeCohortDate !== 'all' &&
    Object.values(marksRecord)?.find(
      record =>
        record.ageCohortDate !== DEFAULT_ALL_RECORD.ageCohortDate &&
        record.ageCohortDate !== 'all' &&
        DateTime.fromJSDate(record.ageCohortDate).hasSame(DateTime.fromJSDate(selectedAgeCohortDate), 'day')
    );

  // Parse value or default to all value (-1)
  const value = selectedMarksRecord ? selectedMarksRecord.value : DEFAULT_ALL.value;

  return {
    marks: filteredMarks,
    marksRecord,
    value,
  };
};
