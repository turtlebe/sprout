import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { buildMetric, mockObservationSelectors, toFahrenheit } from '@plentyag/app-environment/src/common/test-helpers';
import { convertUnitForMetric } from '@plentyag/app-environment/src/common/utils';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useRelatedMetrics } from '.';

mockUseFetchMeasurementTypes();

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useRelatedMetrics', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockUseSwrAxios.mockRestore();
  });

  it('returns undefined', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    const { result } = renderHook(() => useRelatedMetrics({ observationSelectors: null }));

    expect(result.current).toEqual({ data: undefined, isValidating: false });
  });

  it('fetches the metric and returns the ones corresponding to the selectors', () => {
    const [observationSelector1, observationSelector2] = mockObservationSelectors;
    const relatedMetrics = [buildMetric(observationSelector1), buildMetric(observationSelector2)];
    const unrelatedMetrics = [
      buildMetric({ ...observationSelector1, observationName: 'WaterTemperature' }),
      buildMetric({ ...observationSelector2, observationName: 'AirTemperature' }),
    ];

    mockUseSwrAxios.mockReturnValue({
      data: buildPaginatedResponse([...relatedMetrics, ...unrelatedMetrics]),
      isValidating: false,
    });

    const { result } = renderHook(() => useRelatedMetrics({ observationSelectors: mockObservationSelectors }));

    expect(result.current).toEqual({ data: relatedMetrics, isValidating: false });
  });

  it('converts to the preferred unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const [observationSelector1, observationSelector2] = mockObservationSelectors;
    const relatedMetrics = [buildMetric(observationSelector1), buildMetric(observationSelector2)];
    const unrelatedMetrics = [
      buildMetric({ ...observationSelector1, observationName: 'WaterTemperature' }),
      buildMetric({ ...observationSelector2, observationName: 'AirTemperature' }),
    ];

    mockUseSwrAxios.mockReturnValue({
      data: buildPaginatedResponse([...relatedMetrics, ...unrelatedMetrics]),
      isValidating: false,
    });

    const { result } = renderHook(() => useRelatedMetrics({ observationSelectors: mockObservationSelectors }));

    expect(result.current).toEqual({
      data: relatedMetrics.map(convertUnitForMetric(toFahrenheit)),
      isValidating: false,
    });
  });

  it('returns an empty array when there is no related metric created yet', () => {
    const [observationSelector1, observationSelector2] = mockObservationSelectors;
    const unrelatedMetrics = [
      buildMetric({ ...observationSelector1, observationName: 'WaterTemperature' }),
      buildMetric({ ...observationSelector2, observationName: 'AirTemperature' }),
    ];

    mockUseSwrAxios.mockReturnValue({
      data: buildPaginatedResponse(unrelatedMetrics),
      isValidating: false,
    });

    const { result } = renderHook(() => useRelatedMetrics({ observationSelectors: mockObservationSelectors }));

    expect(result.current).toEqual({ data: [], isValidating: false });
  });

  it('returns an empty array when there is no metric created yet', () => {
    mockUseSwrAxios.mockReturnValue({ data: buildPaginatedResponse([]), isValidating: false });

    const { result } = renderHook(() => useRelatedMetrics({ observationSelectors: mockObservationSelectors }));

    expect(result.current).toEqual({ data: [], isValidating: false });
  });
});
