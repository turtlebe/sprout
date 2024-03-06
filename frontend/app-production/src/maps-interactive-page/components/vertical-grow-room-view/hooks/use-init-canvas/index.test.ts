import { renderHook } from '@testing-library/react-hooks';

import { useInitCanvas } from '.';

describe('useInitCanvas', () => {
  it('should initialize canvas context with detailed scaling for retina display support (i.e. 2x scale)', () => {
    // ARRANGE
    // -- mock canvas scale api
    const mockScale = jest.fn();

    // -- mock canvas element and "getContext" api
    const el = document.createElement('canvas');
    // @ts-ignore: overriding to mock canvas
    el.getContext = jest.fn(() => ({ scale: mockScale }));

    // -- mock ref
    const ref = { current: el };

    // ACT
    renderHook(() =>
      useInitCanvas({
        ref,
        width: 100,
        height: 200,
        scaleSize: 2, // style w&h should be 2x
      })
    );

    // ASSERT
    // -- style should have inputted w&h
    expect(el).toHaveStyle('width: 100px;');
    expect(el).toHaveStyle('height: 200px;');
    // -- attribute should be 4x
    expect(el.getAttribute('width')).toEqual('200');
    expect(el.getAttribute('height')).toEqual('400');
    // -- scaling should have been called
    expect(mockScale).toHaveBeenCalledWith(2, 2);
  });
});
