import { renderHook } from '@testing-library/react-hooks';

import { ActionModuleProps } from '../../types';

import { useMultipleActionModulesUtils } from '.';

describe('useMultipleActionModulesUtils', () => {
  function renderUseMultipleActionModulesUtils(props?: ActionModuleProps[]) {
    const mockPropsA = {
      formik: {
        dirty: true,
        submitCount: 2,
        errors: {
          path1: 'This is the first error',
          path2: 'This is the second error',
        },
      },
    } as any;

    const mockPropsB = {
      formik: {
        dirty: false,
        submitCount: 7,
        errors: {
          path3: 'This is the last error',
        },
      },
    } as any;
    return renderHook(() => useMultipleActionModulesUtils(props || [mockPropsA, mockPropsB]));
  }

  it('returns the metadata from all action modules props', () => {
    // ACT
    const { result } = renderUseMultipleActionModulesUtils();
    const { errorList, submitCount, submitAttempted, isDirty } = result.current;

    // ASSERT
    expect(errorList).toEqual(['This is the first error', 'This is the second error', 'This is the last error']);
    expect(submitCount).toEqual(9);
    expect(submitAttempted).toBeTruthy();
    expect(isDirty).toBeTruthy();
  });

  it('returns the metadata from action module props are empty', () => {
    // ARRANGE
    const mockEmptyProps = [
      {
        formik: {
          dirty: false,
          submitCount: 0,
          errors: {},
        },
      } as any,
      {
        formik: {
          dirty: false,
          submitCount: 0,
          errors: {},
        },
      } as any,
    ];

    // ACT
    const { result } = renderUseMultipleActionModulesUtils(mockEmptyProps);
    const { errorList, submitCount, submitAttempted, isDirty } = result.current;

    // ASSERT
    expect(errorList).toEqual([]);
    expect(submitCount).toEqual(0);
    expect(submitAttempted).toBeFalsy();
    expect(isDirty).toBeFalsy();
  });
});
