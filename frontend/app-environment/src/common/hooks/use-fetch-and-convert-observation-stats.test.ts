import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import {
  buildMetric,
  mockMetrics,
  mockObservationStats,
  toFahrenheit,
} from '@plentyag/app-environment/src/common/test-helpers';
import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { actAndAwaitForHook, actAndAwaitRenderHook } from '@plentyag/core/src/test-helpers';
import { axiosRequest } from '@plentyag/core/src/utils';
import { renderHook } from '@testing-library/react-hooks';

import { convertUnitForObservationStats } from '../utils';

import { getAxiosRequestParams, useFetchAndConvertObservationStats } from '.';

jest.mock('@plentyag/core/src/utils/request');

const mockAxiosRequest = axiosRequest as jest.Mock;

const [metric] = mockMetrics;
const observationStats = mockObservationStats;
const observationStatsFahrenheit = convertUnitForObservationStats(toFahrenheit)(observationStats);
const startDateTime = new Date('2023-03-20T00:00:00.000Z');
const endDateTime = new Date('2023-03-21T00:00:00.000Z');
const secondary = [
  { startDateTime: new Date('2023-04-01T00:00:00Z'), endDateTime: new Date('2023-04-02T00:00:00Z') },
  { startDateTime: new Date('2023-04-02T00:00:00Z'), endDateTime: new Date('2023-04-03T00:00:00Z') },
];
const initialProps = {
  metric,
  primary: { startDateTime, endDateTime },
  secondary,
  fetchData: true,
};

mockGlobalSnackbar();
mockUseFetchMeasurementTypes();

describe('useFetchAndConvertObservationStats', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    jest.clearAllMocks();

    mockAxiosRequest.mockResolvedValue({ data: observationStats });
  });

  it('returns null and not loading when fetchData is false', () => {
    const { result } = renderHook(() =>
      useFetchAndConvertObservationStats({
        ...initialProps,
        secondary: [],
        fetchData: false,
      })
    );

    expect(result.current.primary.observationStats).toEqual(null);
    expect(result.current.primary.isLoading).toBe(false);
    expect(result.current.secondary).toEqual([]);
  });

  it('returns null and not loading when fetchData is false for secondary data', () => {
    const { result } = renderHook(() =>
      useFetchAndConvertObservationStats({
        ...initialProps,
        fetchData: false,
      })
    );

    expect(result.current.secondary).toEqual([]);
  });

  it('returns loading states', () => {
    jest.useFakeTimers();

    mockAxiosRequest.mockImplementation(async () => new Promise(() => {}));

    const { result } = renderHook(() => useFetchAndConvertObservationStats(initialProps));

    expect(result.current.primary.observationStats).toBe(null);
    expect(result.current.primary.isLoading).toBe(true);
    expect(result.current.secondary[0].observationStats).toBe(null);
    expect(result.current.secondary[0].isLoading).toBe(true);
    expect(result.current.secondary[1].observationStats).toBe(null);
    expect(result.current.secondary[1].isLoading).toBe(true);
    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, getAxiosRequestParams({ metric, startDateTime, endDateTime }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, getAxiosRequestParams({ metric, ...secondary[0] }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, getAxiosRequestParams({ metric, ...secondary[1] }));

    jest.useRealTimers();
  });

  it('returns observation stats', async () => {
    const { result } = await actAndAwaitRenderHook(() => useFetchAndConvertObservationStats(initialProps));

    expect(result.current.primary.observationStats).toEqual(observationStats);
    expect(result.current.primary.isLoading).toBe(false);
    expect(result.current.secondary[0].observationStats).toEqual(observationStats);
    expect(result.current.secondary[0].isLoading).toBe(false);
    expect(result.current.secondary[1].observationStats).toEqual(observationStats);
    expect(result.current.secondary[1].isLoading).toBe(false);
    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, getAxiosRequestParams({ metric, startDateTime, endDateTime }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, getAxiosRequestParams({ metric, ...secondary[0] }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, getAxiosRequestParams({ metric, ...secondary[1] }));
  });

  it('returns converted observation stats', async () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const { result } = await actAndAwaitRenderHook(() => useFetchAndConvertObservationStats(initialProps));

    expect(result.current.primary.observationStats).toEqual(observationStatsFahrenheit);
    expect(result.current.primary.isLoading).toBe(false);
    expect(result.current.secondary[0].observationStats).toEqual(observationStatsFahrenheit);
    expect(result.current.secondary[0].isLoading).toBe(false);
    expect(result.current.secondary[1].observationStats).toEqual(observationStatsFahrenheit);
    expect(result.current.secondary[1].isLoading).toBe(false);
  });

  it('refetches data when the metric changes', async () => {
    const newMetric = buildMetric({});

    const { rerender } = await actAndAwaitRenderHook(props => useFetchAndConvertObservationStats(props), {
      initialProps,
    });

    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, getAxiosRequestParams({ metric, startDateTime, endDateTime }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, getAxiosRequestParams({ metric, ...secondary[0] }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, getAxiosRequestParams({ metric, ...secondary[1] }));

    await actAndAwaitForHook(() =>
      rerender({
        ...initialProps,
        metric: newMetric,
      })
    );

    expect(mockAxiosRequest).toHaveBeenCalledTimes(6);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      4,
      getAxiosRequestParams({ metric: newMetric, startDateTime, endDateTime })
    );
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(5, getAxiosRequestParams({ metric: newMetric, ...secondary[0] }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(6, getAxiosRequestParams({ metric: newMetric, ...secondary[1] }));
  });

  it('refetches only primary data when the primary dates change', async () => {
    const newStartDateTime = new Date('2023-05-01T00:00:00Z');
    const newEndDateTime = new Date('2023-05-02T00:00:00Z');

    const { rerender } = await actAndAwaitRenderHook(props => useFetchAndConvertObservationStats(props), {
      initialProps,
    });

    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, getAxiosRequestParams({ metric, startDateTime, endDateTime }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, getAxiosRequestParams({ metric, ...secondary[0] }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, getAxiosRequestParams({ metric, ...secondary[1] }));

    await actAndAwaitForHook(() =>
      rerender({
        ...initialProps,
        primary: { startDateTime: newStartDateTime, endDateTime: newEndDateTime },
      })
    );

    expect(mockAxiosRequest).toHaveBeenCalledTimes(4);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      4,
      getAxiosRequestParams({ metric, startDateTime: newStartDateTime, endDateTime: newEndDateTime })
    );
  });

  it('refetches only secondary data when the secondary dates change', async () => {
    const newSecondary = [
      { startDateTime: new Date('2023-05-01T00:00:00Z'), endDateTime: new Date('2023-05-02T00:00:00Z') },
    ];

    const { rerender } = await actAndAwaitRenderHook(props => useFetchAndConvertObservationStats(props), {
      initialProps,
    });

    expect(mockAxiosRequest).toHaveBeenCalledTimes(3);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(1, getAxiosRequestParams({ metric, startDateTime, endDateTime }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(2, getAxiosRequestParams({ metric, ...secondary[0] }));
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(3, getAxiosRequestParams({ metric, ...secondary[1] }));

    await actAndAwaitForHook(() =>
      rerender({
        ...initialProps,
        secondary: newSecondary,
      })
    );

    expect(mockAxiosRequest).toHaveBeenCalledTimes(4);
    expect(mockAxiosRequest).toHaveBeenNthCalledWith(
      4,
      getAxiosRequestParams({
        metric,
        startDateTime: newSecondary[0].startDateTime,
        endDateTime: newSecondary[0].endDateTime,
      })
    );
  });
});
