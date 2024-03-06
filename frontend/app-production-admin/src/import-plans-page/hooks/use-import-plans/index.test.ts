import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
  warningSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { mockUploadBulkCreateTasks } from '../../test-helpers/mock-workcenter-tasks';

import { ERROR_IMPORTING_PLANS, ERROR_NO_TASKS_FOUND, useImportPlans, WARNING_DO_NOT_CLOSE } from '.';

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

describe('useImportPlans', () => {
  beforeEach(() => {
    errorSnackbar.mockRestore();
    successSnackbar.mockRestore();
  });

  it('shows error if trying to import plan without any confimed tasks', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: () => {} });

    const { result } = renderHook(() => useImportPlans(null));

    expect(errorSnackbar).not.toHaveBeenCalled();

    result.current.importPlans({
      onSuccess: jest.fn(),
    });

    expect(errorSnackbar).toHaveBeenCalledWith({ message: ERROR_NO_TASKS_FOUND });
  });

  it('shows error if plan import fails', () => {
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError('ouch'));
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });

    const { result } = renderHook(() => useImportPlans(mockUploadBulkCreateTasks));

    expect(errorSnackbar).not.toHaveBeenCalled();

    const mockOnSuccess = jest.fn();

    result.current.importPlans({
      onSuccess: jest.fn(),
    });

    expect(errorSnackbar).toHaveBeenCalledWith({ title: ERROR_IMPORTING_PLANS, message: 'ouch' });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('calls onSuccess callback when successfully imported', () => {
    const mockSuccessPayload = { message: 'ok' };
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(mockSuccessPayload));
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });

    const { result } = renderHook(() => useImportPlans(mockUploadBulkCreateTasks));

    const mockOnSuccess = jest.fn();

    result.current.importPlans({
      onSuccess: mockOnSuccess,
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(mockSuccessPayload);
    expect(warningSnackbar).toHaveBeenCalledWith(WARNING_DO_NOT_CLOSE);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });
});
