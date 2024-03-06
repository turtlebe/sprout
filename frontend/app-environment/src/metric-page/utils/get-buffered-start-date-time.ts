import { getPreviousIntervalStart } from '@plentyag/app-environment/src/common/utils';
import { Metric } from '@plentyag/core/src/types/environment';
import moment from 'moment';

/**
 * Context: when we edit a Metric, the graph is locked in the interval prior the current interval.
 *
 * We need to make sure the startDateTime is included in that previous interval in order to show data in edit mode.
 */
export function getBufferedStartDateTime(metric: Metric, startDateTime: Date): Date {
  if (!metric || !metric.alertRules?.length) {
    return startDateTime;
  }

  // Find the longest interval.
  const longestInterval = Math.max(...metric.alertRules.map(alertRule => alertRule.repeatInterval));

  if (isNaN(longestInterval)) {
    return startDateTime;
  }

  // Find the AlertRules that have that longest interval.
  const alertRules = metric.alertRules.filter(alertRule => alertRule.repeatInterval === longestInterval);

  // Find the earliest (taking in account its time only) AlertRule
  const [alertRule] = alertRules.sort(({ startsAt: a }, { startsAt: b }) => {
    const ma = moment.utc(a);
    const mb = moment.utc(b);

    return (
      moment.duration(ma.diff(ma.clone().startOf('day'))).as('seconds') -
      moment.duration(mb.diff(mb.clone().startOf('day'))).as('seconds')
    );
  });

  // Calculate when does the interval prior to the one we're currently at starts.
  const previousIntervalStart = getPreviousIntervalStart(alertRule);

  return previousIntervalStart.isBefore(startDateTime) ? previousIntervalStart.toDate() : startDateTime;
}
