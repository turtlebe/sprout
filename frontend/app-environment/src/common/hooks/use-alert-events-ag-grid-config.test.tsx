import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useAlertEventsAgGridConfig } from './use-alert-events-ag-grid-config';

const startDateTime = new Date('2022-01-01T00:00:00Z');
const endDateTime = new Date('2022-02-01T00:00:00Z');
const models = { sortModel: [], filterModel: {}, columnDefs: [] };

describe('useAlertEventsAgGridConfig', () => {
  beforeEach(() => {
    mockUseFetchMeasurementTypes();
  });

  it('returns without filters for startDateTime/endDateTime', () => {
    const { result } = renderHook(() => useAlertEventsAgGridConfig({}));

    expect(result.current.config.getSortFilterServerParams(models)).toEqual({
      startDateTime: undefined,
      endDateTime: undefined,
    });
  });

  it('returns without filters for startDateTime/endDateTime', () => {
    const { result } = renderHook(() => useAlertEventsAgGridConfig({ startDateTime, endDateTime }));

    expect(result.current.config.getSortFilterServerParams(models)).toEqual({
      startDateTime: startDateTime.toISOString(),
      endDateTime: endDateTime.toISOString(),
    });
  });
});
