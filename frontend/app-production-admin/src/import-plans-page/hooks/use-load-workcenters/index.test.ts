import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { mockFarmDefSiteObj } from '@plentyag/core/src/farm-def/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { URL, useLoadWorkcenters } from '.';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;
mockUseSwrAxios.mockReturnValue({ data: mockFarmDefSiteObj, isValidating: false, error: undefined });

const mockCurrentFarmDefPath = 'sites/LAX1/farms/LAX1';
mockCurrentUser({ currentFarmDefPath: mockCurrentFarmDefPath });

describe('useLoadWorkcenters', () => {
  it('returns array of workcenters', () => {
    const { result } = renderHook(() => useLoadWorkcenters());

    expect(mockUseSwrAxios).toHaveBeenCalledWith(expect.objectContaining({ url: `${URL}/${mockCurrentFarmDefPath}` }));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.workcenters).toEqual(Object.values(mockFarmDefSiteObj.workCenters));
  });
});
