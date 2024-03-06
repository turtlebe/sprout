import { buildNormalizedObservation } from '@plentyag/core/src/test-helpers/mocks/environment';
import { NormalizedObservation } from '@plentyag/core/src/types';
import { DateTime } from 'luxon';

export const mockObservations: NormalizedObservation[] = [
  buildNormalizedObservation({
    observedAt: DateTime.now().toUTC().toSQL(),
    observationName: 'HathorConsoleLog',
    valueString: 'log entry 1\n',
  }),
  buildNormalizedObservation({
    observedAt: DateTime.now().toUTC().toSQL(),
    observationName: 'HathorConsoleLog',
    valueString: 'log entry 2\n',
  }),
];
