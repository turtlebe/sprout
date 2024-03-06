import {
  errorSnackbar,
  mockGlobalSnackbar,
  successSnackbar,
} from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { mockFarmDefSiteObj } from '@plentyag/core/src/farm-def/test-helpers';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { ERROR_MUST_SELECTED_WORKCENTERS, ERROR_UPLOADING_TITLE, useUploadPlan } from '.';

const mockWorkcenters = Object.values(mockFarmDefSiteObj.workCenters);

const mockCurrentFarmDefPath = 'sites/LAX1/farms/LAX1';
mockCurrentUser({ currentFarmDefPath: mockCurrentFarmDefPath });

mockGlobalSnackbar();

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

const mockFile = new File(['mock-file'], 'mock-file.txt', { type: 'text/plain' });

describe('useUploadPlan', () => {
  beforeEach(() => {
    errorSnackbar.mockRestore();
    successSnackbar.mockRestore();
  });

  it('shows error if trying to upload plan without selecting workcenters', () => {
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest: () => {} });

    const { result } = renderHook(() =>
      useUploadPlan({
        selectedWorkcenters: [], // not workcenter provided, so should cause error.
      })
    );

    expect(errorSnackbar).not.toHaveBeenCalled();

    result.current.makeUploadRequest({
      file: mockFile,
      onSuccess: jest.fn(),
      onError: jest.fn(),
    });

    expect(errorSnackbar).toHaveBeenCalledWith({ message: ERROR_MUST_SELECTED_WORKCENTERS });
  });

  it('shows error if plan upload fails', () => {
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError('ouch'));
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });

    const { result } = renderHook(() =>
      useUploadPlan({
        selectedWorkcenters: mockWorkcenters,
      })
    );

    expect(errorSnackbar).not.toHaveBeenCalled();

    const mockOnSuccess = jest.fn();

    result.current.makeUploadRequest({
      file: mockFile,
      onSuccess: mockOnSuccess,
      onError: jest.fn(),
    });

    expect(errorSnackbar).toHaveBeenCalledWith({ title: ERROR_UPLOADING_TITLE, message: 'ouch' });
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it('calls onSuccess callback when successfully uploaded', () => {
    const mockSuccessPayload = { message: 'ok' };
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(mockSuccessPayload));
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });

    const { result } = renderHook(() =>
      useUploadPlan({
        selectedWorkcenters: mockWorkcenters,
      })
    );

    const mockOnSuccess = jest.fn();

    result.current.makeUploadRequest({
      file: mockFile,
      onSuccess: mockOnSuccess,
      onError: jest.fn(),
    });

    expect(mockOnSuccess).toHaveBeenCalledWith(mockSuccessPayload);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('calls onError callback when successfully uploaded', () => {
    const mockErrorPayload: any = new Error('Internal server error. Please try again.');
    mockErrorPayload.status = 500;

    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError(mockErrorPayload));
    mockUsePostRequest.mockReturnValue({ isLoading: false, makeRequest });

    const { result } = renderHook(() =>
      useUploadPlan({
        selectedWorkcenters: mockWorkcenters,
      })
    );

    const mockOnError = jest.fn();

    result.current.makeUploadRequest({
      file: mockFile,
      onSuccess: jest.fn(),
      onError: mockOnError,
    });

    expect(mockOnError).toHaveBeenCalledWith(mockErrorPayload);
    expect(errorSnackbar).toHaveBeenCalledWith({
      title: ERROR_UPLOADING_TITLE,
      message: 'Internal server error. Please try again.',
    });
  });
});
