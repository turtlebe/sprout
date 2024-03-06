import { mockPauseBufferOutflowActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useIsActionModuleReady } from '.';

const consoleError = mockConsoleError();

describe('useIsActionModuleReady', () => {
  afterEach(() => {
    consoleError.mockReset();
  });

  it('shows as ready if action model and formik has been initialized', () => {
    // ARRANGE
    const mockFormik = {
      values: {
        mode: {},
      },
    } as any;

    // ACT
    const { result } = renderHook(() =>
      useIsActionModuleReady({
        formik: mockFormik,
        field: 'mode',
        actionModel: mockPauseBufferOutflowActionModel,
      })
    );

    // ASSERT
    expect(result.current).toBeTruthy();
  });

  it('shows as NOT ready if action model has not been initialized', () => {
    // ARRANGE
    const mockFormik = {
      values: {
        mode: {},
      },
    } as any;

    // ACT
    const { result } = renderHook(() =>
      useIsActionModuleReady({
        formik: mockFormik,
        field: 'mode',
        actionModel: null,
      })
    );

    // ASSERT
    expect(result.current).toBeFalsy();
  });

  it('shows as NOT ready if formik has not been initialized', () => {
    // ARRANGE
    const mockFormik = {
      values: {},
    } as any;

    // ACT
    const { result } = renderHook(() =>
      useIsActionModuleReady({
        formik: mockFormik,
        field: 'mode',
        actionModel: mockPauseBufferOutflowActionModel,
      })
    );

    // ASSERT
    expect(result.current).toBeFalsy();
  });

  it('shows as NOT ready and show error if formik and action model is ready, but field is not found', () => {
    // ARRANGE
    const mockFormik = {
      values: {
        mode: {},
      },
    } as any;

    // ACT
    const { result } = renderHook(() =>
      useIsActionModuleReady({
        formik: mockFormik,
        field: 'unknown_field',
        actionModel: mockPauseBufferOutflowActionModel,
      })
    );

    // ASSERT
    expect(result.current).toBeFalsy();
    expect(consoleError).toHaveBeenCalledWith(
      'Field "unknown_field" is not found in this Action "Pause Buffer Outflow"',
      mockPauseBufferOutflowActionModel
    );
  });
});
