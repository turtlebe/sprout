import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '..';

import { useLoadFarmDefObjectWithInitialPath } from '.';

const site = root.sites['SSF2'];

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const id = 'mock-id-1';

describe('useLoadFarmDefObjectWithInitialPath', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();

    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    act(() => result.current[1].resetStore());
  });

  it('does not fetch data when initialPath is null', () => {
    renderHook(() => useLoadFarmDefObjectWithInitialPath(id, null));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('does not fetch data when initialPath is undefined', () => {
    renderHook(() => useLoadFarmDefObjectWithInitialPath(id, undefined));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('does not fetch data when initialPath is empty', () => {
    renderHook(() => useLoadFarmDefObjectWithInitialPath(id, ''));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('fetches data when initialPath contains a valid site loaded in store', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    act(() => result.current[1].addFarmDefObjects([site]));
    renderHook(() => useLoadFarmDefObjectWithInitialPath(id, 'sites/SSF2'));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      { url: '/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2/sites/SSF2?depth=-1' },
      expect.anything()
    );
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('includes child device locations', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    act(() => result.current[1].setOptions({ showDeviceLocations: true }));
    act(() => result.current[1].addFarmDefObjects([site]));
    renderHook(() => useLoadFarmDefObjectWithInitialPath(id, 'sites/SSF2'));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      {
        url: '/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2/sites/SSF2?depth=-1&include_kinds[]=deviceLocation',
      },
      expect.anything()
    );
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });
});
