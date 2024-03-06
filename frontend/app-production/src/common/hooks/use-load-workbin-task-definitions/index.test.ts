import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { act, renderHook } from '@testing-library/react-hooks';

import { mockWorkbinTaskDefinitionData } from '../../test-helpers';

import { useLoadWorkbinTaskDefinitions } from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

mockGlobalSnackbar();
const filterData = { farm: 'sites/LAX1', definitionCreatedByInternalService: false };

describe('useLoadWorkbinTaskDefinitions', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
  });

  it('loads definitions data', () => {
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => {
      act(() => onSuccess(mockWorkbinTaskDefinitionData));
    });
    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });

    const { result } = renderHook(() => useLoadWorkbinTaskDefinitions());
    result.current.loadData(filterData);

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: filterData,
      })
    );
    expect(result.current.workbinTaskDefinitions).toStrictEqual(mockWorkbinTaskDefinitionData);
    expect(result.current.isLoading).toBe(false);
  });

  it('shows error when problem loading definitions', () => {
    const error = 'ouch';
    const makeRequest = jest.fn().mockImplementation(({ onError }) => {
      onError({ error: error });
    });

    mockUsePostRequest.mockReturnValue({ makeRequest, isLoading: false });
    const { result } = renderHook(() => useLoadWorkbinTaskDefinitions());
    result.current.loadData(filterData);

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: filterData,
      })
    );
    expect(result.current.workbinTaskDefinitions).toStrictEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(errorSnackbar).toHaveBeenCalledWith({ message: expect.stringContaining(error) });
  });
});
