import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useSearchMetrics } from './use-search-metrics';
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useSearchMetrics', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('fetches data without a path or metricIds', () => {
    renderHook(() => useSearchMetrics({}));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(expect.objectContaining({ data: {} }));
  });

  it('fetches data without a path or metricIds', () => {
    const path = 'path';
    const ids = ['metric-id-1', 'metric-id-2'];
    renderHook(() => useSearchMetrics({ path, ids }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(expect.objectContaining({ data: { pathContains: path, ids } }));
  });
});
