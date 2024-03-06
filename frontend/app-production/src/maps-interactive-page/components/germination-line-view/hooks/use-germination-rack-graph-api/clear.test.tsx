import { mockGerminationRackGraphScaleReturn } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-germination-rack-scale';
import React from 'react';

import { clear } from './clear';

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

    // -- setup
    const clearFn = clear({
      ref,
      scale: mockGerminationRackGraphScaleReturn,
    });

    // ACT
    clearFn();

    // ASSERT
    expect(node.innerHTML).toEqual('<svg></svg>');
  });

  it('should seemlessly ignore if element is undefined', () => {
    // ARRANGE
    // -- mock ref
    ref = {
      current: undefined,
    } as unknown as React.MutableRefObject<HTMLDivElement>;

    // -- setup
    const clearFn = clear({
      ref,
      scale: mockGerminationRackGraphScaleReturn,
    });

    // ACT
    clearFn();

    // ASSERT
    expect(node.innerHTML).toBe('');
  });
});
