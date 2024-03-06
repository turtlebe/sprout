import { Point } from '@plentyag/core/src/types/environment';
import moment from 'moment';

export function getAdditionalDaysValue(point: Point) {
  return Math.floor(moment.duration(point.time, 'seconds').as('days'));
}
