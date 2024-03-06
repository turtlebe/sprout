import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '..';

import { useLoadFarmDefObjectWithInputValue } from '.';

const site = root.sites['SSF2'];
const area = root.sites['SSF2'].areas['Seeding'];

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const id = 'mock-id-1';

describe('useLoadFarmDefObjectWithInputValue', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();

    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));

    act(() => result.current[1].resetStore());
    act(() => result.current[1].addFarmDefObjects([site, area]));
  });

  it('does not fetch data when inputValue is ""', () => {
    renderHook(() => useLoadFarmDefObjectWithInputValue(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('does not fetch data when the state has a selectedFarmDefObject', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setInputvalue('sites/SSF2'));
    act(() => result.current[1].setSelectedFarmDefObject(area));

    renderHook(() => useLoadFarmDefObjectWithInputValue(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('does not fetch data when the inputValue contains an invalid site', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setInputvalue('sites/UNKNOWN-SITE'));

    renderHook(() => useLoadFarmDefObjectWithInputValue(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith({ url: false }, expect.anything());
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('fetches data when the inputValue contains a valid site path and the state does not have a selectedFarmDefObject', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setInputvalue('sites/SSF2/areas/Seeding'));

    renderHook(() => useLoadFarmDefObjectWithInputValue(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      {
        url: '/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2/sites/SSF2?depth=-1',
      },
      expect.anything()
    );
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });

  it('includes child device locations', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    act(() => result.current[1].setOptions({ showDeviceLocations: true }));
    act(() => result.current[1].setInputvalue('sites/SSF2/areas/Seeding'));

    renderHook(() => useLoadFarmDefObjectWithInputValue(id));

    expect(mockUseSwrAxios).toHaveBeenCalledWith(
      {
        url: '/api/swagger/farm-def-service/objects-v3-api/get-object-by-path2/sites/SSF2?depth=-1&include_kinds[]=deviceLocation',
      },
      expect.anything()
    );
    expect(mockUseSwrAxios).toHaveBeenCalledTimes(1);
  });
});
