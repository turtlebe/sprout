import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useGetFarmDefObjectByPath } from '../../../common/hooks';
import { mockFarmDefSiteObj } from '../../../common/test-helpers';

import { useGetAllowedPaths } from '.';

const currentFarmDefPath = 'sites/SSF2/farms/Tigris';
mockCurrentUser({ currentFarmDefPath });

jest.mock('../../../common/hooks/use-get-farm-def-object-by-path');
const mockUseGetFarmDefObjectByPath = useGetFarmDefObjectByPath as jest.Mock;

mockUseGetFarmDefObjectByPath.mockReturnValue({ data: mockFarmDefSiteObj });

const expectedAllowedPaths = ['sites/SSF2/areas/BMP', 'sites/SSF2/areas/VerticalGrow'];

describe('useGetAllowedPaths', () => {
  it('gets allowedPaths and initialpath when there is no selectedFarmDefPath', () => {
    const { result } = renderHook(() => useGetAllowedPaths());
    expect(result.current.allowedPaths).toEqual(expectedAllowedPaths);
    expect(result.current.initialPath).toBe('sites/SSF2');
  });

  it('gets allowedPaths and intialPath for selectedFarmDefPath - site, line, area', () => {
    const selectedFarmDefPath = 'sites/SSF2/areas/VerticalGrow/lines/Line1';
    const { result } = renderHook(() => useGetAllowedPaths(selectedFarmDefPath));
    expect(result.current.allowedPaths).toEqual(expectedAllowedPaths);
    expect(result.current.initialPath).toBe(selectedFarmDefPath);
  });

  it('gets allowedPaths for selectedFarmDefPath - site, line', () => {
    const selectedFarmDefPath = 'sites/SSF2/areas/BMP';
    const { result } = renderHook(() => useGetAllowedPaths(selectedFarmDefPath));
    expect(result.current.allowedPaths).toEqual(expectedAllowedPaths);
    expect(result.current.initialPath).toBe(selectedFarmDefPath);
  });

  it('resets initialPath when site not allowed in selctedFarmDefPath', () => {
    const selectedFarmDefPath = 'sites/LAX1';
    const { result } = renderHook(() => useGetAllowedPaths(selectedFarmDefPath));
    expect(result.current.allowedPaths).toEqual(expectedAllowedPaths);
    expect(result.current.initialPath).toBe('sites/SSF2');
  });

  it('resets initialPath when area not allowed in selctedFarmDefPath', () => {
    const selectedFarmDefPath = 'sites/SSF2/areas/TaurusGrow';
    const { result } = renderHook(() => useGetAllowedPaths(selectedFarmDefPath));
    expect(result.current.allowedPaths).toEqual(expectedAllowedPaths);
    expect(result.current.initialPath).toBe('sites/SSF2');
  });
});
