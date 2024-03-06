import { mockProcessedUploadHistoryLineItem } from '@plentyag/app-production-admin/src/import-plans-page/test-helpers/mock-upload-history';
import { renderHook } from '@testing-library/react-hooks';

import { useImportedPlansAgGridConfig } from '.';

describe('useImportedPlansAgGridConfig', () => {
  const mockNow = new Date('2023-04-16');

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(mockNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns gridConfig with correct parameters', () => {
    // ACT
    const { result } = renderHook(() => useImportedPlansAgGridConfig([mockProcessedUploadHistoryLineItem]));

    // ASSERT
    expect(result.current).toEqual(
      expect.objectContaining({
        defaultColDef: {
          floatingFilter: true,
          lockPosition: true,
          resizable: true,
          sortable: true,
        },
        immutableData: true,
        rowData: [mockProcessedUploadHistoryLineItem],
      })
    );
    expect(result.current.columnDefs.length).toBe(7);
  });

  it('grabs correct id from "getRowNodeId"', () => {
    // ARRANGE
    const { result } = renderHook(() => useImportedPlansAgGridConfig([mockProcessedUploadHistoryLineItem]));

    // ACT
    const nodeId = result.current.getRowNodeId(mockProcessedUploadHistoryLineItem);

    // ASSERT
    expect(nodeId).toEqual('plenty-workcenter-uploads:7fc10450-2e1a-49bf-ae2a-91312e25a59c4_0');
  });

  it('grabs correct values from each "valueGetter" method', () => {
    // ARRANGE
    // -- use hook
    const { result } = renderHook(() => useImportedPlansAgGridConfig([mockProcessedUploadHistoryLineItem]));
    const { columnDefs } = result.current;

    // -- mock row data
    const mockRowData = { data: mockProcessedUploadHistoryLineItem };

    // ACT
    const rowValueData = columnDefs.map((columnDef: any) => columnDef.valueGetter(mockRowData));

    // ASSERT
    expect(rowValueData).toEqual([
      'CREATED_SUCCESSFULLY',
      '9/24/2022',
      'Seed',
      '7/21/2042',
      2,
      'jvu',
      'google-sheet.xlsx',
    ]);
  });

  it('returns undefined seemlessly if import plans are null', () => {
    // ACT
    const { result } = renderHook(() => useImportedPlansAgGridConfig(null));

    // ASSERT
    expect(result.current).toBeUndefined();
  });
});
