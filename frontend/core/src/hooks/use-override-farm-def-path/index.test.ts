import { errorSnackbar, mockGlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar/test-helper';
import { renderHook } from '@testing-library/react-hooks';

import { useUpdateCurrentFarmDefPath } from '../use-update-current-farm-def-path';

import { useOverrideFarmDefPath } from '.';

mockGlobalSnackbar();

jest.mock('../use-update-current-farm-def-path');
const mockUseUpdateCurrentFarmDefPath = useUpdateCurrentFarmDefPath as jest.Mock;
const mockMakeUpdate = jest.fn();
mockUseUpdateCurrentFarmDefPath.mockReturnValue({ makeUpdate: mockMakeUpdate });

const currentFarmDefPath = 'sites/SSF2/farms/Tigris';
const allowedFarmDefPaths = ['sites/SSF2/farms/Tigris', 'sites/SSF2/farms/Taurus', 'sites/LAX1/farms/LAX1'];

describe('useOverrideFarmDefPath', () => {
  beforeEach(() => {
    mockMakeUpdate.mockClear();
    errorSnackbar.mockClear();
  });

  it('displays error when overrideFarmDefPath is not in allowedFarmDefPaths list', () => {
    const overrideFarmDefPath = 'sites/SSF2/farms/Sierra';
    const { result } = renderHook(() =>
      useOverrideFarmDefPath(currentFarmDefPath, allowedFarmDefPaths, overrideFarmDefPath)
    );

    expect(errorSnackbar).toHaveBeenCalled();
    expect(result.current).toBe(currentFarmDefPath);
    expect(mockMakeUpdate).not.toHaveBeenCalled();
  });

  it('returns override farm def path when override provided', () => {
    const overrideFarmDefPath = allowedFarmDefPaths[1];
    const { result } = renderHook(() =>
      useOverrideFarmDefPath(currentFarmDefPath, allowedFarmDefPaths, overrideFarmDefPath)
    );

    expect(errorSnackbar).not.toHaveBeenCalled();
    expect(result.current).toBe(overrideFarmDefPath);
    expect(mockMakeUpdate).toBeCalledWith(overrideFarmDefPath);
  });

  it('does not cause update if override value does not change from current value', () => {
    const overrideFarmDefPath = allowedFarmDefPaths[1];
    const { result, rerender } = renderHook(() =>
      useOverrideFarmDefPath(currentFarmDefPath, allowedFarmDefPaths, overrideFarmDefPath)
    );

    expect(result.current).toBe(overrideFarmDefPath);

    rerender();

    expect(mockMakeUpdate).toHaveBeenCalledTimes(1);

    expect(result.current).toBe(overrideFarmDefPath);
  });

  it('returns currentFarmDefPath when no override provided', () => {
    const { result } = renderHook(() => useOverrideFarmDefPath(currentFarmDefPath, allowedFarmDefPaths));

    expect(result.current).toBe(currentFarmDefPath);
  });

  it('updates with currentFarmDefPath when override does not change', () => {
    const overrideFarmDefPath = allowedFarmDefPaths[1];
    const { result, rerender } = renderHook(
      ({ updatedCurrentFarmDefPath }) =>
        useOverrideFarmDefPath(updatedCurrentFarmDefPath, allowedFarmDefPaths, overrideFarmDefPath),
      { initialProps: { updatedCurrentFarmDefPath: currentFarmDefPath } }
    );

    expect(result.current).toBe(overrideFarmDefPath);

    const updatedCurrentFarmDefPath = allowedFarmDefPaths[2];
    rerender({ updatedCurrentFarmDefPath });

    expect(result.current).toBe(updatedCurrentFarmDefPath);
  });

  it('returns undefined if override not provided and currentFarmDefPath is falsely', () => {
    const { result } = renderHook(() => useOverrideFarmDefPath('', allowedFarmDefPaths));

    expect(result.current).toBe(undefined);
  });

  it('returns undefined if currentFarmDefPath not provided', () => {
    const overrideFarmDefPath = 'sites/SSF2/farms/Sierra';
    const { result } = renderHook(() => useOverrideFarmDefPath(undefined, allowedFarmDefPaths, overrideFarmDefPath));

    expect(result.current).toBe(undefined);
  });
});
