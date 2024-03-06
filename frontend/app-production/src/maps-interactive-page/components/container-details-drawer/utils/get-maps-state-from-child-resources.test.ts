import {
  mockChildResourcesMapsState,
  mocksChildResources,
} from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';

import { getMapsStateFromChildResources } from './get-maps-state-from-child-resources';

describe('getMapsStateFromChildResources', () => {
  it('returns data in maps state (hash) index format', () => {
    const result = getMapsStateFromChildResources(mocksChildResources);

    expect(result).toEqual(mockChildResourcesMapsState);
  });
});
