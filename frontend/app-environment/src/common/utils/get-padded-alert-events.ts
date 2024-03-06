import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { AlertEvent, AlertEventStatus } from '@plentyag/core/src/types/environment';

import { dedupAlertEvents } from './dedup-alert-events';

/**
 * To correclty display AlertEvents on the graph, we need an array of AlertEvents that conform to those rules:
 * - the array must contain an even number of alert events.
 * - alert rules at odd indexes (0, 2, 4, ...) should have a triggered status.
 * - alert rules at even indexes (1, 3, 5, ...) should have a resolved status.
 *
 * If the alert events passed has odd number of alert events, we will pad the array at the start or end with a triggered
 * or resolved alert event.
 *
 * If the alert events passed has even numbers, we need to verify that it starts with a triggered alert event
 * and ends with an resolved alert event. If not we pad the array with two new alert events.
 */
export function getPaddedAlertEvents(
  alertEvents: AlertEvent[],
  observations: RolledUpByTimeObservation[]
): AlertEvent[] {
  if (!alertEvents.length || !observations.length) {
    return [];
  }

  const data = dedupAlertEvents(alertEvents);

  if (data.length % 2 !== 0) {
    if (data[0].status === AlertEventStatus.triggered) {
      data.push({
        ...data[0],
        status: AlertEventStatus.resolved,
        generatedAt: observations[observations.length - 1].rolledUpAt,
      });
    } else {
      data.unshift({
        ...data[0],
        status: AlertEventStatus.triggered,
        generatedAt: observations[0].rolledUpAt,
      });
    }
  } else {
    if (data[0].status === AlertEventStatus.resolved) {
      data.unshift({
        ...data[0],
        status: AlertEventStatus.triggered,
        generatedAt: observations[0].rolledUpAt,
      });
      data.push({
        ...data[0],
        status: AlertEventStatus.resolved,
        generatedAt: observations[observations.length - 1].rolledUpAt,
      });
    }
  }

  return data;
}
