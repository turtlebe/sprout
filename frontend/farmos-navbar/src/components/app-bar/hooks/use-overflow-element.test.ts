import { renderHook } from '@testing-library/react-hooks';

import { MockResizeObserver } from '../../../test-helpers/resize-observer';

import { useOverflowElement } from './use-overflow-element';

describe('useOverflowElement', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: MockResizeObserver });
  });

  afterAll(() => {
    delete window.ResizeObserver;
  });

  it('returns true indicating element overflows', () => {
    const mockElement = {
      clientWidth: 200,
      scrollWidth: 300,
    };

    const { result } = renderHook(() => useOverflowElement(mockElement as HTMLDivElement));

    expect(result.current).toEqual({ isOverflowing: true });
  });

  it('returns false indicating element does not overflow', () => {
    const mockElement = {
      clientWidth: 200,
      scrollWidth: 200,
    };

    const { result } = renderHook(() => useOverflowElement(mockElement as HTMLDivElement));

    expect(result.current).toEqual({ isOverflowing: false });
  });
});
