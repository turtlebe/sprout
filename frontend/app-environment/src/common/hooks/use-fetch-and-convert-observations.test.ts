import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import {
  mockMetrics,
  mockRolledUpByTimeObservations as observations,
  toFahrenheit,
} from '@plentyag/app-environment/src/common/test-helpers';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useUnpaginate } from '@plentyag/core/src/hooks';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { DEFAULT_TIME_GRANULARITY, timeGranularities } from '../utils/constants';

import { useFetchAndConvertObservations } from '.';

jest.mock('@plentyag/core/src/hooks/use-unpaginate');

const mockUseUnpaginate = useUnpaginate as jest.Mock;
const makeRequest = jest.fn();

const [metric] = mockMetrics;
const startDateTime = new Date(observations[0].rolledUpAt);
const endDateTime = new Date(observations.slice(-1)[0].rolledUpAt);
const timeGranularity = DEFAULT_TIME_GRANULARITY;

mockGlobalSnackbar();
mockUseFetchMeasurementTypes();

describe('useFetchAndConvertObservations', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockUseUnpaginate.mockRestore();
    makeRequest.mockRestore();
  });

  it('returns undefined when loading', () => {
    const response = { data: undefined, isLoading: true, makeRequest };
    mockUseUnpaginate.mockReturnValue(response);

    const { result } = renderHook(() =>
      useFetchAndConvertObservations({ metric, startDateTime, endDateTime, timeGranularity })
    );

    expect(result.current.data).toEqual(response.data);
    expect(result.current.isLoading).toEqual(response.isLoading);
  });

  it('returns the paginated response without converting the data', () => {
    const response = { data: observations, isLoading: false, makeRequest };
    mockUseUnpaginate.mockReturnValue(response);

    const { result } = renderHook(() =>
      useFetchAndConvertObservations({ metric, startDateTime, endDateTime, timeGranularity })
    );

    expect(result.current.data).toEqual(response.data);
    expect(result.current.isLoading).toEqual(response.isLoading);
  });

  it('returns the paginated response without converting the data when there is not preferred unit', () => {
    const response = { data: observations, isLoading: false, makeRequest };
    mockUseUnpaginate.mockReturnValue(response);

    const { result } = renderHook(() =>
      useFetchAndConvertObservations({ metric, startDateTime, endDateTime, timeGranularity })
    );

    expect(result.current.data).toEqual(observations);
    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          path: metric.path,
          measurementType: metric.measurementType,
          observationName: metric.observationName,
          order: 'asc',
          timeGranularity: DEFAULT_TIME_GRANULARITY.value,
          isNumerical: true,
        },
      })
    );
  });

  it('returns the paginated response without converting the data when the preferred unit is the default unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'C' });
    const response = { data: observations, isLoading: false, makeRequest };
    mockUseUnpaginate.mockReturnValue(response);

    const { result } = renderHook(() =>
      useFetchAndConvertObservations({ metric, startDateTime, endDateTime, timeGranularity })
    );

    expect(result.current.data).toEqual(observations);
    expect(result.current.data.length).toBeGreaterThan(0);
    result.current.data.forEach((observation, index) => {
      expect(observation.mean).toBe(observations[index].mean);
      expect(observation.median).toBe(observations[index].median);
      expect(observation.min).toBe(observations[index].min);
      expect(observation.max).toBe(observations[index].max);
    });
  });

  it('returns the paginated response and convert everything to the preferred unit', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    const response = { data: observations, isLoading: false, makeRequest };
    mockUseUnpaginate.mockReturnValue(response);

    const { result } = renderHook(() =>
      useFetchAndConvertObservations({ metric, startDateTime, endDateTime, timeGranularity })
    );

    expect(result.current.data).not.toEqual(observations);
    expect(result.current.data.length).toBeGreaterThan(0);
    result.current.data.forEach((observation, index) => {
      expect(observation.mean).toBe(toFahrenheit(observations[index].mean));
      expect(observation.median).toBe(toFahrenheit(observations[index].median));
      expect(observation.min).toBe(toFahrenheit(observations[index].min));
      expect(observation.max).toBe(toFahrenheit(observations[index].max));
    });
  });

  it('refetches data with a different time granularity', () => {
    const response = { data: observations, isLoading: false, makeRequest };
    mockUseUnpaginate.mockReturnValue(response);

    const { rerender } = renderHook(useFetchAndConvertObservations, {
      initialProps: { metric, startDateTime, endDateTime, timeGranularity },
    });

    rerender({ metric, startDateTime, endDateTime, timeGranularity: timeGranularities.find(t => t.value === 60) });

    expect(makeRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: {
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          path: metric.path,
          measurementType: metric.measurementType,
          observationName: metric.observationName,
          order: 'asc',
          timeGranularity: timeGranularity.value,
          isNumerical: true,
        },
      })
    );
    expect(makeRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: {
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          path: metric.path,
          measurementType: metric.measurementType,
          observationName: metric.observationName,
          order: 'asc',
          timeGranularity: 60,
          isNumerical: true,
        },
      })
    );
  });

  it('logs an error in the snackbar', () => {
    const error = 'error';
    makeRequest.mockImplementation(({ onError }) => onError(error));
    const response = { data: observations, isLoading: false, makeRequest };

    mockUseUnpaginate.mockReturnValue(response);

    renderHook(() => useFetchAndConvertObservations({ metric, startDateTime, endDateTime, timeGranularity }));

    expect(errorSnackbar).toHaveBeenCalledWith({ message: error });
  });
});
