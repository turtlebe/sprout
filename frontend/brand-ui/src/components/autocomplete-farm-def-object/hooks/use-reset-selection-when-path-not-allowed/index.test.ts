import { root } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { act, renderHook } from '@testing-library/react-hooks';

import { useAutocompleteFarmDefObjectStore } from '..';

import { useResetSelectionWhenPathNotAllowed } from '.';

const site = root.sites['SSF2'];
const area = root.sites['SSF2'].areas['Seeding'];

const id = 'mock-id-1';
const initialPath = site.path;
const allowedPaths = [area.path];

describe('useResetSelectionWhenPathNotAllowed', () => {
  function renderHookUseAutocompleteFarmDefObjectStore(selectedObject: AllowedObjects, inputValue: string) {
    const { result } = renderHook(() => useAutocompleteFarmDefObjectStore(id));
    const actions = result.current[1];
    act(() => actions.resetStore());
    act(() => actions.addFarmDefObjects([site, area]));
    act(() => actions.setSelectedFarmDefObject(selectedObject));
    act(() => actions.setInputvalue(inputValue));
    act(() => actions.setIsOpen(true));

    return result;
  }

  it('makes no updates when allowedPath not provided', () => {
    const result = renderHookUseAutocompleteFarmDefObjectStore(area, area.path);
    const initialState = result.current[0];

    renderHook(() => useResetSelectionWhenPathNotAllowed(id, initialPath));

    const state = result.current[0];
    expect(state).toEqual(initialState);
    expect(state.selectedFarmDefObject).toEqual(area);
    expect(state.inputValue).toBe(area.path);
    expect(state.isOpen).toBe(true);
  });

  it('makes no updates when nothing is selected', () => {
    const result = renderHookUseAutocompleteFarmDefObjectStore(null, area.path);
    const initialState = result.current[0];

    renderHook(() => useResetSelectionWhenPathNotAllowed(id, initialPath, allowedPaths));

    const state = result.current[0];
    expect(state).toEqual(initialState);
    expect(state.selectedFarmDefObject).toEqual(null);
    expect(state.inputValue).toBe(area.path);
    expect(state.isOpen).toBe(true);
  });

  it('makes no updates when selectedFarmDefObject is in allowedPaths', () => {
    const result = renderHookUseAutocompleteFarmDefObjectStore(area, area.path);
    const initialState = result.current[0];

    renderHook(() => useResetSelectionWhenPathNotAllowed(id, initialPath, allowedPaths));

    const state = result.current[0];
    expect(state).toEqual(initialState);
    expect(state.selectedFarmDefObject).toEqual(area);
    expect(state.inputValue).toBe(area.path);
    expect(state.isOpen).toBe(true);
  });

  it('resets selection to initial path when selection is not in allowedPaths', () => {
    const selection = root.sites['SSF2'].areas['VerticalGrow'];
    const result = renderHookUseAutocompleteFarmDefObjectStore(selection, area.path);
    const initialState = result.current[0];

    renderHook(() => useResetSelectionWhenPathNotAllowed(id, initialPath, allowedPaths));

    const state = result.current[0];
    expect(state).not.toEqual(initialState);
    expect(state.selectedFarmDefObject).toEqual(site);
    expect(state.inputValue).toBe(initialPath);
    expect(state.isOpen).toBe(false);
  });

  it('resets selection to null when selection is not in allowedPaths and state does not contain object given by initialPath', () => {
    const selection = root.sites['SSF2'].areas['VerticalGrow'];
    const result = renderHookUseAutocompleteFarmDefObjectStore(selection, area.path);
    const initialState = result.current[0];

    renderHook(() => useResetSelectionWhenPathNotAllowed(id, 'sites/SSF2/areas/Germination', allowedPaths));

    const state = result.current[0];
    expect(state).not.toEqual(initialState);
    expect(state.selectedFarmDefObject).toEqual(null);
    expect(state.inputValue).toBe('');
    expect(state.isOpen).toBe(false);
  });
});
