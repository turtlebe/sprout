import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { Metric } from '@plentyag/core/src/types/environment';
import { zip } from 'lodash';

export function getJsonData(metrics: Metric[], observations: RolledUpByTimeObservation[][]) {
  return zip(metrics, observations).map(([metric, observations]) => ({ metric, observations }));
}
