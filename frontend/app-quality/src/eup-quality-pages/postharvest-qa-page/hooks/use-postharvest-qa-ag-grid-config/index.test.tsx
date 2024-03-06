import { renderHook } from '@testing-library/react-hooks';

import { usePostharvestQaAgGridConfig } from '.';

describe('usePostharvestQaAgGridConfig', () => {
  it('sets correct AG Grid config columns and data', () => {
    // ACT
    const { result } = renderHook(() => usePostharvestQaAgGridConfig({}));

    // ASSERT
    expect(result.current.columnDefs).toEqual([
      expect.objectContaining({
        headerName: 'Status',
        field: 'status',
        colId: 'status',
      }),
      expect.objectContaining({
        headerName: 'Packaging Lot',
        field: 'lot',
        colId: 'lot',
        filter: 'agTextColumnFilter',
      }),
      expect.objectContaining({
        headerName: 'Sku',
        field: 'sku',
        colId: 'sku',
        filter: 'agTextColumnFilter',
      }),
      expect.objectContaining({
        headerName: 'First audit at',
        field: 'firstAuditAt',
        colId: 'firstAuditAt',
      }),
      expect.objectContaining({
        headerName: 'Last audit at',
        field: 'lastAuditAt',
        colId: 'lastAuditAt',
      }),
      expect.objectContaining({
        headerName: 'Total',
        field: 'totalAudits',
        colId: 'totalAudits',
        filter: 'agTextColumnFilter',
      }),

      expect.objectContaining({
        colId: 'observation',
        field: 'observation',
        headerName: 'Observation',
      }),
    ]);
  });
});
