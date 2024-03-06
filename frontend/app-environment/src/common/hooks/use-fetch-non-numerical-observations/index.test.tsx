import { DEFAULT_TIME_GRANULARITY, timeGranularities } from '@plentyag/app-environment/src/common/utils/constants';
import { useUnpaginate } from '@plentyag/core/src/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

import { mockMetrics, mockNormalizedObservation } from '../../test-helpers';

import { useFetchNonNumericalObservations } from '.';

const [metric] = mockMetrics;

jest.mock('@plentyag/core/src/hooks/use-unpaginate');

const mockUseUnpaginate = useUnpaginate as jest.Mock;
const makeRequest = jest.fn();

const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');
const valueAttribute = 'valueAttribute';

describe('useFetchNonNumericalObservations', () => {
  beforeEach(() => {
    mockUseUnpaginate.mockRestore();
    makeRequest.mockRestore();
  });

  it('returns a loading state', () => {
    mockUseUnpaginate.mockReturnValue({ makeRequest, data: undefined, isLoading: false });

    const { result } = renderHook(() =>
      useFetchNonNumericalObservations({
        metric,
        startDateTime,
        endDateTime,
        timeGranularity: DEFAULT_TIME_GRANULARITY,
      })
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.makeRequest).toEqual(makeRequest);
    expect(result.current.makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          path: metric.path,
          measurementType: metric.measurementType,
          observationName: metric.observationName,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          isNumerical: false,
          order: 'asc',
          timeGranularity: DEFAULT_TIME_GRANULARITY.value,
          valueAttribute: undefined,
        },
      })
    );
  });

  it('fetches data with valueAttribute', () => {
    mockUseUnpaginate.mockReturnValue({ makeRequest, data: undefined, isLoading: false });

    const { result } = renderHook(() =>
      useFetchNonNumericalObservations({
        metric,
        startDateTime,
        endDateTime,
        timeGranularity: DEFAULT_TIME_GRANULARITY,
        valueAttribute,
      })
    );

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.makeRequest).toEqual(makeRequest);
    expect(result.current.makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          path: metric.path,
          measurementType: metric.measurementType,
          observationName: metric.observationName,
          startDateTime: startDateTime.toISOString(),
          endDateTime: endDateTime.toISOString(),
          isNumerical: false,
          order: 'asc',
          timeGranularity: DEFAULT_TIME_GRANULARITY.value,
          valueAttribute,
        },
      })
    );
  });

  it('returns a previousTimeGranularity and previousValueAttribute when the request succeeds', () => {
    jest.useFakeTimers();

    const newTimeGranularity = timeGranularities[0];
    const newValueAttribute = 'newValueAttribute';
    const makeRequest = jest.fn(({ onSuccess }) => setTimeout(onSuccess, 200000));
    mockUseUnpaginate.mockReturnValue({ makeRequest, data: mockNormalizedObservation, isLoading: false });

    const { result, rerender } = renderHook(
      ({ timeGranularity, valueAttribute }) =>
        useFetchNonNumericalObservations({
          metric,
          startDateTime,
          endDateTime,
          timeGranularity,
          valueAttribute,
        }),
      { initialProps: { timeGranularity: DEFAULT_TIME_GRANULARITY, valueAttribute } }
    );

    expect(result.current.previousTimeGranularity).toEqual(DEFAULT_TIME_GRANULARITY);
    expect(result.current.previousValueAttribute).toEqual(valueAttribute);

    rerender({ timeGranularity: newTimeGranularity, valueAttribute: newValueAttribute });

    expect(result.current.previousTimeGranularity).toEqual(DEFAULT_TIME_GRANULARITY);
    expect(result.current.previousValueAttribute).toEqual(valueAttribute);

    act(() => jest.runAllTimers());

    expect(result.current.previousTimeGranularity).toEqual(newTimeGranularity);
    expect(result.current.previousValueAttribute).toEqual(newValueAttribute);

    jest.useRealTimers();
  });

  it('returns data', () => {
    mockUseUnpaginate.mockReturnValue({ makeRequest, data: mockNormalizedObservation, isLoading: false });

    const { result } = renderHook(() =>
      useFetchNonNumericalObservations({
        metric,
        startDateTime,
        endDateTime,
        timeGranularity: DEFAULT_TIME_GRANULARITY,
      })
    );

    expect(result.current.data).toEqual(mockNormalizedObservation);
    expect(result.current.isLoading).toBe(false);
  });
});
