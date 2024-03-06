import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { fields, useGroupedAlertEventsAgGridConfig } from './use-grouped-alert-events-ag-grid-config';

describe('useGroupedAlertEventsAgGridConfig', () => {
  beforeEach(() => {
    mockUseFetchMeasurementTypes();
  });

  it('returns a config for grouping alert events by path', () => {
    const { result } = renderHook(() => useGroupedAlertEventsAgGridConfig());

    expect((result.current.columnDefs[0] as ColDef).rowGroup).toBe(true);
    expect(result.current.columnDefs.map(colDef => (colDef as ColDef).field)).toEqual([
      fields.path,
      fields.generatedAt,
      fields.status,
      fields.measurementType,
      fields.observationName,
      fields.alertRuleType,
      fields.source,
    ]);
  });
});
