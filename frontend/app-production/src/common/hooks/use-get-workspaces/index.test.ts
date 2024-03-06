import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { mockWorkspaces } from '../../test-helpers';

import { useGetWorkspaces } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

mockGlobalSnackbar();

describe('useGetWorkspaces', () => {
  it('loads workspaces data', () => {
    mockUseSwrAxios.mockReturnValue({
      data: mockWorkspaces,
      isValidating: false,
      error: undefined,
    });

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current.workspaces).toEqual(mockWorkspaces);
    expect(result.current.isLoading).toBe(false);
  });

  it('shows error when problem loading workspaces', () => {
    const error = 'ouch';
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: false,
      error,
    });

    const { result } = renderHook(() => useGetWorkspaces());

    expect(result.current.workspaces).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(errorSnackbar).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining(error) }));
  });
});
