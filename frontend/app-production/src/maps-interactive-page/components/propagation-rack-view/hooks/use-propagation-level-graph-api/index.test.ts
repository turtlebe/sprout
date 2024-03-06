import { mockPropagationLevelScaleReturn } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-propagation-level-scale';
import { renderHook } from '@testing-library/react-hooks';
import { createRef } from 'react';

import { usePropagationLevelGraphApi } from '.';

describe('usePropagationLevelGraphApi', () => {
  it('returns graph api functions', () => {
    const { result } = renderHook(() =>
      usePropagationLevelGraphApi({
        ref: createRef<HTMLDivElement>(),
        scale: mockPropagationLevelScaleReturn,
      })
    );
    expect(result.current.clear).toBeDefined();
    expect(result.current.renderGraph).toBeDefined();
  });
});
