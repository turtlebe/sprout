import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { act, renderHook } from '@testing-library/react-hooks';

import { mockWorkbinTriggerData } from '../../test-helpers';

import { useLoadWorkbinTriggers } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

mockGlobalSnackbar();

describe('useLoadWorkbinTriggers', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
  });

  it('loads trigger data', () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => {
      act(() => onSuccess(mockWorkbinTriggerData));
    });
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { result } = renderHook(() => useLoadWorkbinTriggers());
    result.current.loadData({ farm: 'sites/LAX1' });

    expect(makeRequest).toHaveBeenCalled();
    expect(result.current.workbinTaskTriggers).toStrictEqual(mockWorkbinTriggerData);
    expect(result.current.isLoading).toBe(false);
  });

  it('shows error when problem loading triggers', () => {
    const error = 'ouch';
    const makeRequest = jest.fn().mockImplementation(({ onError }) => {
      onError({ error: error });
    });

    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });
    const { result } = renderHook(() => useLoadWorkbinTriggers());
    result.current.loadData({ farm: 'sites/LAX1' });

    expect(makeRequest).toHaveBeenCalled();
    expect(result.current.workbinTaskTriggers).toStrictEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(errorSnackbar).toHaveBeenCalledWith({ message: expect.stringContaining(error) });
  });
});
