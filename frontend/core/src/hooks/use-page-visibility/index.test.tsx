import { act, renderHook } from '@testing-library/react-hooks';

import { usePageVisibility } from '.';

describe('usePageVisibility', () => {
  let originalVisibility;
  beforeEach(() => {
    originalVisibility = document.visibilityState;
  });

  afterEach(() => {
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: originalVisibility,
    });
  });

  it('sets initial visiblity', () => {
    const mockInitialState: VisibilityState = 'visible';
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      value: mockInitialState,
    });
    const { result } = renderHook(() => usePageVisibility());

    expect(result.current).toBe(mockInitialState);
  });

  it('updates visibility when change occurs', () => {
    let mockVisiblityState: VisibilityState = 'visible';

    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => mockVisiblityState,
    });

    const { result } = renderHook(() => usePageVisibility());

    expect(result.current).toBe(mockVisiblityState);

    mockVisiblityState = 'hidden';

    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(result.current).toBe(mockVisiblityState);
  });
});
