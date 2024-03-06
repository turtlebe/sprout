import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useGetWorkcenters } from '.';

mockGlobalSnackbar();
mockConsoleError();

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const errorMessage = 'ouch';
mockUseSwrAxios.mockReturnValue({
  data: undefined,
  isValidating: false,
  error: errorMessage,
});

describe('useGetWorkcenters', () => {
  afterEach(() => {
    mockUseSwrAxios.mockClear();
  });

  it('shows snackbar error when loading produces error', () => {
    const { result } = renderHook(() => useGetWorkcenters());
    expect(result.current.workcenters).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(errorSnackbar).toHaveBeenCalled();
  });

  it('loads workcenters associated with optional "workspace"', () => {
    const mockWorkspace = 'mock-ws';
    renderHook(() => useGetWorkcenters(mockWorkspace));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { role_name: mockWorkspace },
      })
    );
  });
});
