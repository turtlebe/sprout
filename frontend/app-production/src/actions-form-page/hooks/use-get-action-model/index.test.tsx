import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { emptyAction, useGetActionModel } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const actionPath =
  'sites/SSF2/areas/PrimaryPostHarvest/lines/ToteProcessing/machines/ToteFiller/interfaces/ToteFiller/methods/ToteFilled';

const mockOperation: ProdActions.Operation = {
  path: actionPath,
  prefilledArgs: {},
};

describe('useGetActionModel()', () => {
  it('gives empty action when no action path provided', () => {
    mockUseSwrAxios.mockImplementation(() => {
      return {
        isValidating: true,
        data: undefined,
      };
    });

    const { result } = renderHook(() => useGetActionModel(undefined));
    expect(result.current.action).toEqual(emptyAction);
  });

  it('gives empty action when loading', () => {
    mockUseSwrAxios.mockImplementation(() => {
      return {
        isValidating: true,
        data: undefined,
      };
    });

    const { result } = renderHook(() => useGetActionModel(mockOperation));

    expect(result.current.action).toEqual(emptyAction);
  });
});
