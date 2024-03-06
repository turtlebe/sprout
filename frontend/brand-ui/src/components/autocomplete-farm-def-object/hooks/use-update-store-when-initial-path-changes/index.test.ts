import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '..';

import { useUpdateStoreWhenInitialPathChanges } from '.';

const ssf2 = root.sites['SSF2'];

describe('useUpdateStoreWhenInitialPathChanges', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-global'));
    const [, actions] = result.current;

    act(() => actions.resetStore());
  });

  it('resets the inputValue and selectedFarmDefObject when initalPath becomes undefined', () => {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore('mock-id-1'));

    expect(result.current[0].inputValue).toBe('');
    expect(result.current[0].selectedFarmDefObject).toBeNull();

    act(() => result.current[1].setInputvalue('SSF2/'));
    act(() => result.current[1].setSelectedFarmDefObject(ssf2));

    expect(result.current[0].inputValue).toBe('SSF2/');
    expect(result.current[0].selectedFarmDefObject).toEqual(ssf2);

    const { rerender } = renderHook(
      ({ initialPath }) => useUpdateStoreWhenInitialPathChanges('mock-id-1', initialPath),
      { initialProps: { initialPath: '' } }
    );

    expect(result.current[0].inputValue).toBe('SSF2/');
    expect(result.current[0].selectedFarmDefObject).toEqual(ssf2);

    rerender({ initialPath: ssf2.path });

    expect(result.current[0].inputValue).toBe('SSF2/');
    expect(result.current[0].selectedFarmDefObject).toEqual(ssf2);

    rerender({ initialPath: '' });

    expect(result.current[0].inputValue).toBe('');
    expect(result.current[0].selectedFarmDefObject).toBeNull();
  });
});
