import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { ObservationsByTime, TimeSummarization } from '@plentyag/core/src/types/environment';
import { groupBy, sum } from 'lodash';

export function getObservationStreamsMinMax(
  observationStreams: RolledUpByTimeObservation[][],
  timeSummarization: TimeSummarization
) {
  const mins = [];
  const maxs = [];

  // Calculate Min/Max for numerical ObservationStreams
  if (timeSummarization && timeSummarization !== TimeSummarization.value) {
    observationStreams.filter(Boolean).forEach(observations => {
      const values = observations
        .filter(observation => !observation.noData)
        .map(observation => observation[timeSummarization]);

      if (!values.length) {
        return;
      }

      mins.push(Math.min(...values));
      maxs.push(Math.max(...values));
    });
  }

  // Calculate Min/Max for non-numerical ObservationStreams
  if (timeSummarization && timeSummarization === TimeSummarization.value) {
    mins.push(0);
    observationStreams.filter(Boolean).forEach(observations => {
      const observationsGroupedByTime: ObservationsByTime[] = Object.entries(groupBy(observations, 'rolledUpAt')).map(
        item => ({ rolledUpAt: item[0], observations: item[1] })
      );

      observationsGroupedByTime.forEach(({ observations }) => {
        maxs.push(sum(observations.map(observation => observation.valueCount)));
      });
    });
  }

  return {
    min: mins.length ? Math.min(...mins) : NaN,
    max: maxs.length ? Math.max(...maxs) : NaN,
  };
}
