import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '..';

import { useLoadFarmDefObjectWithSelectedOption } from '.';

const site = root.sites['SSF2'];
const otherSite = root.sites['LAX1'];
const area = root.sites['SSF2'].areas['Seeding'];

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const id = 'mock-id-1';

describe('useLoadFarmDefObjectWithSelectedOption', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();

    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    act(() => result.current[1].resetStore());
    act(() => result.current[1].addFarmDefObjects([site, area]));
  });

  it('does not fetch data when selectedFarmDefObject is not a site', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setSelectedFarmDefObject(area));
    renderHook(() => useLoadFarmDefObjectWithSelectedOption(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('does not fetch data when selectedFarmDefObject is an already loaded site', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setSelectedFarmDefObject(site));
    renderHook(() => useLoadFarmDefObjectWithSelectedOption(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('fetches data when selectedFarmDefObject is a site which its descendant have not already been loaded', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setSelectedFarmDefObject(otherSite));
    renderHook(() => useLoadFarmDefObjectWithSelectedOption(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      {
        url: '/api/swagger/farm-def-service/objects-v3-api/get-object-by-id2/aa0d43c7-9b68-4f9d-bb1e-edd607fade17?depth=-1',
      },
      expect.anything()
    );
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('includes child device locations', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setOptions({ showDeviceLocations: true }));
    act(() => result.current[1].setSelectedFarmDefObject(otherSite));
    renderHook(() => useLoadFarmDefObjectWithSelectedOption(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      {
        url: '/api/swagger/farm-def-service/objects-v3-api/get-object-by-id2/aa0d43c7-9b68-4f9d-bb1e-edd607fade17?depth=-1&include_kinds[]=deviceLocation',
      },
      expect.anything()
    );
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });
});
