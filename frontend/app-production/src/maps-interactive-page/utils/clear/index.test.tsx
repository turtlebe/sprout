import React from 'react';

import { clear } from '.';

describe('clear', () => {
  let node, ref;
  beforeEach(() => {
    // ARRANGE
    // -- create DOM element & ref
    node = document.createElement('div');
    ref = {
      current: node,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
  });
  it('clears inner svg elements', () => {
    // ARRANGE
    // -- mock html
    node.innerHTML = '<svg><g></g><g></g></svg>';
    // ACT
    clear(ref);
    // ASSERT
    expect(node.innerHTML).toEqual('<svg></svg>');
  });
  it('should seemlessly ignore if element is undefined', () => {
    // ARRANGE
    // -- mock ref
    ref = {
      current: undefined,
    } as unknown as React.MutableRefObject<HTMLDivElement>;
    // ACT
    clear(ref);
    // ASSERT
    expect(node.innerHTML).toBe('');
  });
});
