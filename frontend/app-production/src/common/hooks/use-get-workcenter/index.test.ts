import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useGetWorkcenter } from '.';

mockGlobalSnackbar();
mockConsoleError();

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const errorMessage = 'ouch';

describe('useGetWorkcenter', () => {
  afterEach(() => {
    errorSnackbar.mockClear();
  });

  it('shows snackbar error when loading produces error', () => {
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: false,
      error: errorMessage,
    });
    const { result } = renderHook(() => useGetWorkcenter('Seed'));
    expect(result.current.workcenter).toBe(undefined);
    expect(result.current.isLoading).toBe(false);
    expect(errorSnackbar).toHaveBeenCalled();
  });

  it('does not show error when validating in progress', () => {
    mockUseSwrAxios.mockReturnValue({
      data: undefined,
      isValidating: true,
      error: errorMessage,
    });
    const { result } = renderHook(() => useGetWorkcenter('Seed'));
    expect(result.current.workcenter).toBe(undefined);
    expect(result.current.isLoading).toBe(true);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });
});
