import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';

import { useFetchMeasurementTypes } from '.';

jest.mock('@plentyag/core/src/hooks/use-fetch-measurement-types');

export function mockUseFetchMeasurementTypes() {
  (useFetchMeasurementTypes as jest.Mock).mockReturnValue({ measurementTypes: mockMeasurementTypes, isLoading: false });
}
