import { mockContainersResourceState } from '@plentyag/app-production/src/common/test-helpers';
import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { useGetContainersResourceState } from '.';

jest.mock('@plentyag/core/src/hooks');
const mockUsePostRequest = usePostRequest as jest.Mock;

mockGlobalSnackbar();

const mockSerials = [
  mockContainersResourceState[0].containerObj.serial,
  mockContainersResourceState[1].containerObj.serial,
];

describe('useGetContainersResourceState', () => {
  it('fetches mock data and calls "onSuccess" with data', () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(mockContainersResourceState));
    mockUsePostRequest.mockReturnValue({
      isLoading: false,
      makeRequest,
    });
    const { result } = renderHook(() => useGetContainersResourceState());

    const mockSuccess = jest.fn();
    result.current.fetch(mockSerials, mockSuccess);

    expect(mockSuccess).toHaveBeenCalledWith(mockContainersResourceState);
    expect(errorSnackbar).not.toHaveBeenCalled();
  });

  it('shows snackbar when api returns an error', () => {
    const makeRequest = jest.fn().mockImplementation(({ onError }) => onError('ouch'));
    mockUsePostRequest.mockReturnValue({
      isLoading: false,
      makeRequest,
    });
    const { result } = renderHook(() => useGetContainersResourceState());

    const mockSuccess = jest.fn();
    result.current.fetch(mockSerials, mockSuccess);

    expect(mockSuccess).not.toHaveBeenCalled();
    expect(errorSnackbar).toHaveBeenCalled();
  });
});
