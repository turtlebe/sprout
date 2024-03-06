import { Point } from '@plentyag/core/src/types/environment';
import { DateTimeFormat } from '@plentyag/core/src/utils';
import { get, isNil } from 'lodash';
import { DateTime } from 'luxon';

export interface GetHandleInfoLabel {
  point: Point<Date>;
  unitSymbol: string;
  yAttribute?: string;
}

/**
 * For a given Point (AlertRule's Rule or Schedule's Action) returns a text with the value and time of the point.
 */
export function getHandleInfoLabel({ point, yAttribute, unitSymbol }: GetHandleInfoLabel) {
  const value = get(point, yAttribute);
  if (isNil(value)) {
    return;
  }
  return `${value} ${unitSymbol} | ${DateTime.fromJSDate(point.time).toFormat(DateTimeFormat.US_TIME_ONLY)}`;
}
