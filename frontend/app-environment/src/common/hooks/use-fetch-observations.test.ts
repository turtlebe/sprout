import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import {
  mockMetrics,
  mockRolledUpByTimeObservations,
  toFahrenheit,
} from '@plentyag/app-environment/src/common/test-helpers';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwaitForHook } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils/request';
import { renderHook } from '@testing-library/react-hooks';

import { convertUnitForRolledUpByTimeObservation, getColorGenerator } from '../utils';
import { DEFAULT_TIME_GRANULARITY, timeGranularities } from '../utils/constants';

import { useFetchObservations } from '.';

jest.mock('@plentyag/core/src/utils/request');

mockGlobalSnackbar();
mockUseFetchMeasurementTypes();

const mockAxiosRequest = axiosRequest as jest.Mock;

const startDateTime = new Date(mockRolledUpByTimeObservations[0].rolledUpAt);
const endDateTime = new Date(mockRolledUpByTimeObservations.slice(-1)[0].rolledUpAt);
const isoStartDateTime = startDateTime.toISOString();
const isoEndDateTime = endDateTime.toISOString();
const timeGranularity = DEFAULT_TIME_GRANULARITY;
const timeGranularity15m = timeGranularities.find(t => t.value === 15);

describe('useRelatedObservations', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockAxiosRequest.mockRestore();
  });

  it('returns undefined', async () => {
    const { result } = renderHook(() =>
      useFetchObservations({ metrics: null, startDateTime, endDateTime, timeGranularity })
    );

    await actAndAwaitForHook(() => result.current);

    expect(result.current).toEqual(expect.objectContaining({ data: undefined, isValidating: false }));
  });

  it('executes one query per selector', async () => {
    const colorGenerator = getColorGenerator();
    const metricsWithObservations = mockMetrics.map(metric => ({
      observations: mockRolledUpByTimeObservations,
      metric,
      colors: colorGenerator.next().value,
    }));
    mockAxiosRequest.mockResolvedValue({ data: mockRolledUpByTimeObservations });

    const { result, rerender } = renderHook(useFetchObservations, {
      initialProps: {
        metrics: mockMetrics,
        startDateTime,
        endDateTime,
        timeGranularity: timeGranularity15m,
      },
    });

    await actAndAwaitForHook(() => result.current);

    expect(result.current).toEqual(expect.objectContaining({ data: metricsWithObservations, isValidating: false }));
    expect(mockAxiosRequest).toHaveBeenCalledTimes(mockMetrics.length);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          bodyRequest: expect.objectContaining({
            path: mockMetrics[0].path,
            measurementType: mockMetrics[0].measurementType,
            observationName: mockMetrics[0].observationName,
            startDateTime: isoStartDateTime,
            endDateTime: isoEndDateTime,
            timeGranularity: 15,
          }),
        }),
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          bodyRequest: expect.objectContaining({
            path: mockMetrics[1].path,
            measurementType: mockMetrics[1].measurementType,
            observationName: mockMetrics[1].observationName,
            startDateTime: isoStartDateTime,
            endDateTime: isoEndDateTime,
            timeGranularity: 15,
          }),
        }),
      })
    );

    await actAndAwaitForHook(() =>
      rerender({
        metrics: mockMetrics,
        startDateTime,
        endDateTime,
        timeGranularity: DEFAULT_TIME_GRANULARITY,
      })
    );

    expect(mockAxiosRequest).toHaveBeenCalledTimes(mockMetrics.length * 2);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        data: expect.objectContaining({
          bodyRequest: expect.objectContaining({
            path: mockMetrics[0].path,
            measurementType: mockMetrics[0].measurementType,
            observationName: mockMetrics[0].observationName,
            startDateTime: isoStartDateTime,
            timeGranularity: 5,
          }),
        }),
      })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        data: expect.objectContaining({
          bodyRequest: expect.objectContaining({
            path: mockMetrics[1].path,
            measurementType: mockMetrics[1].measurementType,
            observationName: mockMetrics[1].observationName,
            endDateTime: isoEndDateTime,
            timeGranularity: 5,
          }),
        }),
      })
    );
  });

  it('shows an error message when one of the request fails', async () => {
    mockAxiosRequest.mockRejectedValue({ error: 'error' });

    const { result } = renderHook(() =>
      useFetchObservations({
        metrics: mockMetrics,
        startDateTime,
        endDateTime,
        timeGranularity,
      })
    );

    await actAndAwaitForHook(() => result.current);

    expect(result.current.isValidating).toBe(false);

    expect(errorSnackbar).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'error', title: expect.any(String) })
    );
  });

  it('converts to the preferred unit', async () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    const colorGenerator = getColorGenerator();

    const metricsWithObservations = mockMetrics.map(metric => ({
      observations: mockRolledUpByTimeObservations.map(convertUnitForRolledUpByTimeObservation(toFahrenheit)),
      metric,
      colors: colorGenerator.next().value,
    }));

    mockAxiosRequest.mockResolvedValue({ data: mockRolledUpByTimeObservations });

    const { result } = renderHook(() =>
      useFetchObservations({
        metrics: mockMetrics,
        startDateTime,
        endDateTime,
        timeGranularity: timeGranularity15m,
      })
    );

    await actAndAwaitForHook(() => result.current);

    expect(result.current).toEqual(expect.objectContaining({ data: metricsWithObservations, isValidating: false }));
  });
});
