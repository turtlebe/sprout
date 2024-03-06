import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useCancelTask } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

const mockTaskId = '82917fc4-0ee1-460b-b0e8-eae6fb512033';
const mockReactorPath = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance';

mockGlobalSnackbar();

describe('useCancelTask', () => {
  beforeEach(() => {
    errorSnackbar.mockRestore();
  });

  it('calls onSuccess when cancel is completed', () => {
    const mockOnSuccess = jest.fn();

    mockUsePostRequest.mockReturnValue({
      makeRequest: ({ onSuccess }) => {
        onSuccess();
      },
    });

    const { result } = renderHook(() =>
      useCancelTask({ taskId: mockTaskId, reactorPath: mockReactorPath, onSuccess: mockOnSuccess })
    );

    result.current.cancelTask();

    expect(mockOnSuccess).toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalledTimes(0);
  });

  it('shows error when cancel fails', () => {
    const mockOnSuccess = jest.fn();

    const mockError = 'ouch';

    mockUsePostRequest.mockReturnValue({
      makeRequest: ({ onError }) => {
        onError(mockError);
      },
    });

    const { result } = renderHook(() =>
      useCancelTask({ taskId: mockTaskId, reactorPath: mockReactorPath, onSuccess: mockOnSuccess })
    );

    result.current.cancelTask();

    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalledTimes(1);
    expect(errorSnackbar).toHaveBeenLastCalledWith({
      title: expect.anything(),
      message: expect.stringContaining(mockError),
    });
  });
});
