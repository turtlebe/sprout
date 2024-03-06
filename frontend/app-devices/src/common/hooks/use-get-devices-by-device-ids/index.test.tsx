import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { SEARCH_DEVICES_URL, useGetDevicesByDeviceIds } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useGetDevicesByDeviceIds', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
  });

  it('returns no data', () => {
    renderHook(() => useGetDevicesByDeviceIds(null));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });

  it('returns no data', () => {
    renderHook(() => useGetDevicesByDeviceIds([]));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(false);
  });

  it('returns data', () => {
    renderHook(() => useGetDevicesByDeviceIds(['id1', 'id2']));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: SEARCH_DEVICES_URL,
      method: 'POST',
      data: { deviceIds: ['id1', 'id2'], sortBy: 'serial', order: 'asc' },
    });
  });
});
