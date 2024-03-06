import { RolledUpByTimeObservation } from '@plentyag/core/src/types';
import { isEqual, pick, uniqWith } from 'lodash';

const sourceAttributes = ['clientId', 'deviceId', 'tagPath'];

export function getUniqSources(observations: RolledUpByTimeObservation[] = []) {
  return uniqWith(observations, (a, b) => isEqual(pick(a, sourceAttributes), pick(b, sourceAttributes)));
}
