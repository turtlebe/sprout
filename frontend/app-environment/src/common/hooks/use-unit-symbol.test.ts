import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useUnitSymbol } from './use-unit-symbol';

describe('useUnitSymbol', () => {
  beforeEach(() => {
    clearUnitPreferenceLocalStorage();
    mockUseFetchMeasurementTypes();
  });

  it('returns null', () => {
    const { result } = renderHook(() => useUnitSymbol());

    expect(
      result.current.getUnitSymbol({ measurementType: 'CATEGORICAL_STATE', graphable: true, oneOf: ['on', 'off'] })
    ).toBe(null);
  });

  it('returns C', () => {
    const { result } = renderHook(() => useUnitSymbol());

    expect(result.current.getUnitSymbol({ measurementType: 'TEMPERATURE', graphable: true, from: 0, to: 100 })).toBe(
      '(C)'
    );
  });

  it('returns F', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const { result } = renderHook(() => useUnitSymbol());

    expect(result.current.getUnitSymbol({ measurementType: 'TEMPERATURE', graphable: true, from: 0, to: 100 })).toBe(
      '(F)'
    );
  });
});
