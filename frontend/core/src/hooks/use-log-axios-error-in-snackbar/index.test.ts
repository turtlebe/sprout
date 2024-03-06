import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useLogAxiosErrorInSnackbar } from '.';

const consoleError = mockConsoleError();

mockGlobalSnackbar();

const mockErrorMessage = 'error!!!';

describe('useLogAxiosErrorInSnackbar', () => {
  beforeEach(() => {
    consoleError.mockReset();
  });

  it('shows console.error message', () => {
    renderHook(() => useLogAxiosErrorInSnackbar(mockErrorMessage));
    expect(consoleError).toHaveBeenCalledWith(mockErrorMessage);
    expect(errorSnackbar).toHaveBeenCalledWith({ message: mockErrorMessage });
  });

  it('does not show console.error message', () => {
    const mockTitle = 'title';
    renderHook(() => useLogAxiosErrorInSnackbar(mockErrorMessage, mockTitle, true));
    expect(consoleError).not.toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalledWith({ message: mockErrorMessage, title: mockTitle });
  });
});
