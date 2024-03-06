import { AlertEvent } from '@plentyag/core/src/types/environment';

/**
 * This function deduplicate consecutive AlertEvents with the same status. The function assumed that the alert events are sorted by generatedAt.
 *
 * For example:
 * "TRIGGERED, TRIGGERED, TRIGGERED, RESOLVED, TRIGGERED, RESOLVED, RESOLVED, TRIGGERED" should return
 * "TRIGGERED, RESOLVED, TRIGGERED, RESOLVED, TRIGGERED"
 */
export function dedupAlertEvents(alertEvents: AlertEvent[]): AlertEvent[] {
  if (!alertEvents.length) {
    return [];
  }

  const data = [];
  let lastStatus: AlertEvent['status'];

  for (const alertEvent of alertEvents) {
    if (lastStatus && alertEvent.status === lastStatus) {
      continue;
    }

    data.push(alertEvent);
    lastStatus = alertEvent.status;
  }

  return data;
}
