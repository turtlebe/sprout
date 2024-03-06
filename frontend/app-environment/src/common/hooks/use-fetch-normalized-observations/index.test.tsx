import { useUnpaginate } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { mockMetrics, mockNormalizedObservation } from '../../test-helpers';

import { useFetchNormalizedObservations } from '.';

const [metric] = mockMetrics;

jest.mock('@plentyag/core/src/hooks/use-unpaginate');

const mockUseUnpaginate = useUnpaginate as jest.Mock;
const makeRequest = jest.fn();

const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-01-02T00:00:00Z');

describe('useFetchNormalizedObservations', () => {
  beforeEach(() => {
    mockUseUnpaginate.mockRestore();
    makeRequest.mockRestore();
  });

  it('returns a loading state', () => {
    mockUseUnpaginate.mockReturnValue({ makeRequest, data: undefined, isLoading: false });

    const { result } = renderHook(() =>
      useFetchNormalizedObservations({
        metric,
        startDateTime,
        endDateTime,
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
          partialPath: true,
          order: 'asc',
        },
      })
    );
  });

  it('returns data', () => {
    mockUseUnpaginate.mockReturnValue({ makeRequest, data: mockNormalizedObservation, isLoading: false });

    const { result } = renderHook(() =>
      useFetchNormalizedObservations({
        metric,
        startDateTime,
        endDateTime,
      })
    );

    expect(result.current.data).toEqual(mockNormalizedObservation);
    expect(result.current.isLoading).toBe(false);
    expect(makeRequest).toHaveBeenCalled();
  });

  it('does not fetch anything when the props are missing', () => {
    mockUseUnpaginate.mockReturnValue({ makeRequest, data: undefined, isLoading: false });

    const { result } = renderHook(() => useFetchNormalizedObservations(undefined));

    expect(result.current.data).toEqual(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(makeRequest).not.toHaveBeenCalled();
  });
});
