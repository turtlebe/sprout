import { mockRolledUpByTimeObservations } from '@plentyag/app-environment/src/common/test-helpers';
import { RolledUpByTimeObservation } from '@plentyag/core/src/types';

import { getUniqSources } from './get-uniq-sources';

const [observation] = mockRolledUpByTimeObservations;
const observations: RolledUpByTimeObservation[] = [
  {
    ...observation,
    clientId: 'lar1_taghistory',
    tagPath: 'pod1/ainpodtemperature/val_scaledpv',
  },
  {
    ...observation,
    clientId: 'lar1_taghistory',
    tagPath: 'pod1/ainpodtemperature/val_scaledpv',
  },
  {
    ...observation,
    clientId: 'lar1_taghistory',
    tagPath: 'pod2/ainpodtemperature/val_scaledpv',
  },
  {
    ...observation,
    clientId: 'd52313ec-086d-4e32-80d9-5e57af8d2800',
    deviceId: 'b91aa867-cec6-44f6-be27-19beca54b9e3',
  },
  {
    ...observation,
    clientId: 'd52313ec-086d-4e32-80d9-5e57af8d2800',
    deviceId: 'b91aa867-cec6-44f6-be27-19beca54b9e3',
  },
  {
    ...observation,
    clientId: 'd52313ec-086d-4e32-80d9-5e57af8d2800',
    deviceId: 'f1542d33-c3cf-49a1-8fed-1b0318b6364a',
  },
  {
    ...observation,
    clientId: 'd52313ec-086d-4e32-80d9-5e57af8d2800',
    deviceId: 'f1542d33-c3cf-49a1-8fed-1b0318b6364a',
  },
];

describe('getUniqSources', () => {
  it('deduplicates observations based on their sources', () => {
    expect(getUniqSources(observations)).toEqual([observations[0], observations[2], observations[3], observations[5]]);
  });
});
