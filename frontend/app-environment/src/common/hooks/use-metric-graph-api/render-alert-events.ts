import { getPaddedAlertEvents } from '@plentyag/app-environment/src/common/utils';
import { DEFAULT_TIME_SUMMARIZATION } from '@plentyag/app-environment/src/common/utils/constants';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { AlertEvent, AlertEventStatus, TimeSummarization } from '@plentyag/core/src/types/environment';
import * as d3 from 'd3';

import { RenderFunction } from '.';

export interface RenderAlertEvents {
  alertEvents: AlertEvent[];
  observations: RolledUpByTimeObservation[];
  timeSummarization: TimeSummarization;
}

/**
 * Render AlertEvents on the Graph based on Observations.
 *
 * Essentially this function renders multiple lines on top of the main Data line with a red color to indicate
 * that this data was out of range and generated alerts events.
 */
export const renderAlertEvents: RenderFunction<RenderAlertEvents> =
  ({ ref, scale }) =>
  ({ alertEvents = [], observations = [], timeSummarization = DEFAULT_TIME_SUMMARIZATION }) => {
    const { x, y, paddingX, paddingY } = scale;

    if (!alertEvents.length || !observations.length) {
      return;
    }

    // `getPaddedAlertEvents` takes care of always having even number of alertEvents,
    // and the first and last AlertEvents will always AlertEventStatus.triggered.
    const data = getPaddedAlertEvents(
      alertEvents.filter(alertEvent =>
        [AlertEventStatus.resolved, AlertEventStatus.triggered].includes(alertEvent.status)
      ),
      observations
    );

    const bisectObservation = d3.bisector<RolledUpByTimeObservation, Date>(d => new Date(d.rolledUpAt));

    data.forEach((alertEvent, index) => {
      // Skip even number so that we can loop through `data` by pairs.
      if (index % 2 !== 0) {
        return;
      }

      // For each pair TRIGGERED/RESOLVED AlertEvent,
      const triggeredAlertEvent = alertEvent;
      const resolvedAlertEvent = data[index + 1];

      // Find the Observations indexes in that intersect with the TRIGGERRED/RESOLVED AlertEvents.
      const indexStart = bisectObservation.left(observations, new Date(triggeredAlertEvent.generatedAt));
      const indexFinish = bisectObservation.right(observations, new Date(resolvedAlertEvent.generatedAt));

      // Slice the subset of Observations that corresponds to the observations between the TRIGGERED/RESOLVED AlertEvents.
      const outOfRangeObservations = observations.slice(indexStart, indexFinish);

      // Render the observations
      d3.select(ref.current)
        .append('g')
        .attr('clip-path', 'url("#frame")')
        .attr('transform', `translate(${paddingX}, ${paddingY})`)
        .append('path')
        .datum(outOfRangeObservations)
        .attr('class', 'alert-event')
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 1.5)
        .attr(
          'd',
          d3
            .line<RolledUpByTimeObservation>()
            .x(d => x(new Date(d.rolledUpAt)))
            .y(d => y(d[timeSummarization]))
        );
    });
  };
