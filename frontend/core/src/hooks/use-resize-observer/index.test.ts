import { renderHook } from '@testing-library/react-hooks';
import React from 'react';

import { MockResizeObserver } from '../../test-helpers/stubs/resize-observer';

import { useResizeObserver } from '.';

describe('useResizeObserver', () => {
  beforeAll(() => {
    // Mock ResizeObserver
    Object.defineProperty(window, 'ResizeObserver', { configurable: true, value: MockResizeObserver });
  });

  afterAll(() => {
    // Clean up
    delete window.ResizeObserver;
  });

  it('returns correct initial size of element (fires handler right away)', () => {
    // ARRANGE
    const mockRef = {
      current: {
        clientWidth: 200,
        clientHeight: 300,
      },
    };

    // ACT
    const { result } = renderHook(() => useResizeObserver(mockRef as React.RefObject<HTMLDivElement>));

    // ASSERT
    expect(result.current).toEqual({ width: 200, height: 300 });
  });
});
