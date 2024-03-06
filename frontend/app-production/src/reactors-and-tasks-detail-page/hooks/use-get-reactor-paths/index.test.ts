import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useGetReactorPaths } from '.';

mockGlobalSnackbar();

const mockReactorPathsForSSF2 = {
  'sites/SSF2/areas/BMP': 'com.reactor1',
  'sites/SSF2/areas/VerticalGrow': 'com.reactor2',
};

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useGetReactorPaths', () => {
  it('gets reactor paths when currentFarmDefPath is provided', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: mockReactorPathsForSSF2 });

    const currentFarmDefPath = 'sites/SSF2/farms/Tigris';
    mockCurrentUser({ currentFarmDefPath });
    const { result } = renderHook(() => useGetReactorPaths());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.reactorPaths).toHaveLength(2);
    expect(result.current.reactorPaths[0]).toBe(Object.keys(mockReactorPathsForSSF2)[0]);
    expect(result.current.reactorPaths[1]).toBe(Object.keys(mockReactorPathsForSSF2)[1]);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('shows error message when error is returned', () => {
    mockUseSwrAxios.mockReturnValue({ isValidating: false, data: undefined, error: 'ouch' });

    const currentFarmDefPath = 'sites/SSF2/farms/Tigris';
    mockCurrentUser({ currentFarmDefPath });
    const { result } = renderHook(() => useGetReactorPaths());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.reactorPaths).toBeUndefined();
    expect(errorSnackbar).toHaveBeenCalled();
  });
});
