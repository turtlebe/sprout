import { useSwrAxios } from '@plentyag/core/src/hooks';
import { renderHook } from '@testing-library/react-hooks';

import { getFarmDefObjectByPathUrl, useGetFarmDefSiteObject } from './use-get-farm-def-site-object';

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

describe('useGetFarmDefSiteObject', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('loads when site is provided', () => {
    renderHook(() => useGetFarmDefSiteObject({ site: 'LAX1' }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({
      url: expect.stringContaining(`${getFarmDefObjectByPathUrl}/sites/LAX1`),
    });
  });

  it('does not load when site is not provided', () => {
    renderHook(() => useGetFarmDefSiteObject({ site: undefined }));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: undefined });
  });
});
