import { mockObservationGroups } from '@plentyag/core/src/test-helpers/mocks';

import { useFetchObservationGroups } from '.';

jest.mock('@plentyag/core/src/hooks/use-fetch-observation-groups');

export function mockUseFetchObservationGroups() {
  (useFetchObservationGroups as jest.Mock).mockReturnValue({
    observationGroups: mockObservationGroups,
    isLoading: false,
  });
}
