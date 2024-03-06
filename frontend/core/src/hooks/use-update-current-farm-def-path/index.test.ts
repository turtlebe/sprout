import { mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES, mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePutRequest } from '@plentyag/core/src/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

import { useUpdateCurrentFarmDefPath } from '.';

jest.mock('@plentyag/core/src/hooks');
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockMakeRequest = jest.fn(({ onSuccess }) => {
  onSuccess();
});
mockUsePutRequest.mockReturnValue({ makeRequest: mockMakeRequest });

mockGlobalSnackbar();

const mockSetCurrentFarmDefPath = jest.fn();
mockCurrentUser(undefined, { setCurrentFarmDefPath: mockSetCurrentFarmDefPath });

describe('useUpdateCurrentFarmDefPath', () => {
  beforeEach(() => {
    mockSetCurrentFarmDefPath.mockClear();
    mockMakeRequest.mockClear();
  });

  it('does not update when value is same as currentFarmDefPath', () => {
    const { result } = renderHook(() => useUpdateCurrentFarmDefPath());

    act(() => {
      result.current.makeUpdate(DEFAULT_CURRENT_USER_IMPL_ATTRIBUTES.currentFarmDefPath);
    });

    expect(mockMakeRequest).not.toHaveBeenCalled();
  });

  it('updates when value is different than currentFarmDefPath', () => {
    const { result } = renderHook(() => useUpdateCurrentFarmDefPath());

    const updateCurrentFarmDefPath = 'sites/SSF2/farms/Tigris';
    act(() => {
      result.current.makeUpdate(updateCurrentFarmDefPath);
    });

    expect(mockMakeRequest).toHaveBeenCalledWith({
      data: {
        currentFarmDefPath: updateCurrentFarmDefPath,
      },
      onSuccess: expect.anything(),
      onError: expect.anything(),
    });
    expect(mockSetCurrentFarmDefPath).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentFarmDefPath).toHaveBeenCalledWith(updateCurrentFarmDefPath);
  });
});
