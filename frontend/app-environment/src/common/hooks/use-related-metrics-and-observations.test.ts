import { useFetchObservations } from '@plentyag/app-environment/src/common/hooks/use-fetch-observations';
import {
  buildMetric,
  mockObservationSelectors,
  mockRolledUpByTimeObservations,
} from '@plentyag/app-environment/src/common/test-helpers';
import { DEFAULT_TIME_GRANULARITY } from '@plentyag/app-environment/src/common/utils/constants';
import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { renderHook } from '@testing-library/react-hooks';
import moment from 'moment';

import { useRelatedMetrics, useRelatedMetricsAndObservations } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
jest.mock('@plentyag/app-environment/src/common/hooks/use-fetch-observations');
jest.mock('./use-related-metrics');

const mockUseSwrAxios = useSwrAxios as jest.Mock;
const mockUseRelatedMetrics = useRelatedMetrics as jest.Mock;
const mockUseFetchObservations = useFetchObservations as jest.Mock;

const startDateTime = moment();
const endDateTime = moment().add(1, 'day');
const scheduleDefinition = root.sites['SSF2'].areas['Seeding'].scheduleDefinitions['ThermalTemperature'];
const timeGranularity = DEFAULT_TIME_GRANULARITY;

describe('useRelatedMetricsAndObservations', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    mockUseRelatedMetrics.mockRestore();
    mockUseFetchObservations.mockRestore();
  });

  it('returns undefined', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUseRelatedMetrics.mockReturnValue({ data: undefined, isValidating: false });
    mockUseFetchObservations.mockReturnValue({ data: undefined, isValidating: false });

    const { result } = renderHook(() =>
      useRelatedMetricsAndObservations({
        scheduleDefinition,
        startDateTime: startDateTime.toDate(),
        endDateTime: endDateTime.toDate(),
        timeGranularity,
      })
    );

    expect(result.current).toEqual({ data: undefined, isValidating: false });
  });

  it('returns undefined and isValidating set to true when fetching observationSelectors', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: true });
    mockUseRelatedMetrics.mockReturnValue({ data: undefined, isValidating: false });
    mockUseFetchObservations.mockReturnValue({ data: undefined, isValidating: false });

    const { result } = renderHook(() =>
      useRelatedMetricsAndObservations({
        scheduleDefinition,
        startDateTime: startDateTime.toDate(),
        endDateTime: endDateTime.toDate(),
        timeGranularity,
      })
    );

    expect(result.current).toEqual({ data: undefined, isValidating: true });
  });

  it('returns undefined and isValidating set to true when useRelatedMetrics is loading', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUseRelatedMetrics.mockReturnValue({ data: undefined, isValidating: true });
    mockUseFetchObservations.mockReturnValue({ data: undefined, isValidating: false });

    const { result } = renderHook(() =>
      useRelatedMetricsAndObservations({
        scheduleDefinition,
        startDateTime: startDateTime.toDate(),
        endDateTime: endDateTime.toDate(),
        timeGranularity,
      })
    );

    expect(result.current).toEqual({ data: undefined, isValidating: true });
  });

  it('returns undefined and isValidating set to true when useFetchObservations is loading', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });
    mockUseRelatedMetrics.mockReturnValue({ data: undefined, isValidating: false });
    mockUseFetchObservations.mockReturnValue({ data: undefined, isValidating: true });

    const { result } = renderHook(() =>
      useRelatedMetricsAndObservations({
        scheduleDefinition,
        startDateTime: startDateTime.toDate(),
        endDateTime: endDateTime.toDate(),
        timeGranularity,
      })
    );

    expect(result.current).toEqual({ data: undefined, isValidating: true });
  });

  it('returns metrics with their associated observations', () => {
    const relatedMetrics = mockObservationSelectors.map(buildMetric);
    mockUseSwrAxios.mockReturnValue({ data: mockObservationSelectors, isValidating: false });
    mockUseRelatedMetrics.mockReturnValue({ data: relatedMetrics, isValidating: false });
    mockUseFetchObservations.mockReturnValue({
      data: relatedMetrics.map(metric => ({ metric, observations: mockRolledUpByTimeObservations })),
      isValidating: false,
    });

    const { result } = renderHook(() =>
      useRelatedMetricsAndObservations({
        scheduleDefinition,
        startDateTime: startDateTime.toDate(),
        endDateTime: endDateTime.toDate(),
        timeGranularity,
      })
    );

    expect(result.current).toEqual({
      data: relatedMetrics.map(metric => ({ metric, observations: mockRolledUpByTimeObservations })),
      isValidating: false,
    });
  });
});
