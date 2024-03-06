import { mockGerminationRackGraphScaleReturn } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-germination-rack-scale';
import { renderHook } from '@testing-library/react-hooks';
import { createRef } from 'react';

import { useGerminationRackGraphApi } from '.';

describe('useGerminationRackGraphApi', () => {
  it('returns graph api functions', () => {
    const { result } = renderHook(() =>
      useGerminationRackGraphApi({
        ref: createRef<HTMLDivElement>(),
        scale: mockGerminationRackGraphScaleReturn,
      })
    );

    expect(result.current.clear).toBeDefined();
    expect(result.current.renderGraph).toBeDefined();
  });
});
