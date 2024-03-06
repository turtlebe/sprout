import { useSwrAxios } from '@plentyag/core/src/hooks';
import { buildPaginatedResponse } from '@plentyag/core/src/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { metrics } from '../test-helpers/mocks';

import { useSelectedMetrics } from './use-selected-metrics';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useSelectedMetrics', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('returns an empty array when no metric ids are passed during init', () => {
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { result } = renderHook(() => useSelectedMetrics({ metricIds: [] }));

    expect(result.current.metrics).toEqual([]);

    act(() => result.current.setMetrics(metrics));

    expect(result.current.metrics).toEqual(metrics);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });

  it('initializes the metrics with metricIds', () => {
    const selectedMetrics = [metrics[1], metrics[2]];
    const selectedMetricsIds = selectedMetrics.map(metric => metric.id);
    mockUseSwrAxios.mockReturnValue({ data: buildPaginatedResponse(selectedMetrics), isValidating: false });

    const { result } = renderHook(() => useSelectedMetrics({ metricIds: selectedMetrics.map(metric => metric.id) }));

    expect(result.current.metrics).toEqual(selectedMetrics);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(expect.objectContaining({ data: { ids: selectedMetricsIds } }));

    act(() => result.current.setMetrics(metrics));

    expect(result.current.metrics).toEqual(metrics);
    expect(mockUseSwrAxios).toHaveBeenCalledWith(expect.objectContaining({ data: { ids: selectedMetricsIds } }));
  });
});
