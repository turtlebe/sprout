import { ObservationStats, RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { TimeSummarization } from '@plentyag/core/src/types/environment';
import { mean, median, std } from 'mathjs';

export function getObservationStatsFromObservations(
  observations: RolledUpByTimeObservation[],
  timeSummarization: TimeSummarization
): ObservationStats {
  if (!observations?.length || timeSummarization === TimeSummarization.value) {
    return null;
  }

  const observationValues = observations.filter(o => !o.noData).map(o => o[timeSummarization]);

  if (!observationValues.length) {
    return null;
  }

  return {
    min: Math.min(...observationValues),
    max: Math.max(...observationValues),
    mean: mean(observationValues),
    median: median(observationValues),
    stddev: std(observationValues),
    count: observationValues.length,
  };
}
