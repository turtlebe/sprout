import { renderHook } from '@testing-library/react-hooks';

import { useExtendedAgGridWithExpandableRows } from '.';

describe('useExtendedAgGridWithExpandableRows', () => {
  it('extends existing AG Grid config with an expandable row', () => {
    // ARRANGE
    // -- mock data
    const mockData = [
      {
        rowId: '123',
        message: 'hi',
      },
    ];

    // -- mock existing ag grid config
    const mockAgGridConfig = {
      columnDefs: [
        {
          headerName: 'Existing Column 1',
          field: 'col1',
          colId: 'col1',
          valueGetter: () => 'col 1',
        },
      ],
      frameworkComponents: {
        fullWidthCellRenderer: jest.fn(),
      },
      fullWidthCellRenderer: 'fullWidthCellRenderer',
      rowData: mockData,
    };

    // ACT
    const { result } = renderHook(() =>
      useExtendedAgGridWithExpandableRows({
        agGridConfig: mockAgGridConfig,
        expandedRowHeight: 50,
        renderExpandableRow: jest.fn(),
      })
    );

    // ASSERT
    // -- merged ag grid config
    expect(result.current).toEqual(
      expect.objectContaining({
        masterDetail: true,
        detailRowHeight: 50,
        frameworkComponents: {
          fullWidthCellRenderer: expect.anything(),
          detailCellRenderer: expect.anything(),
        },
        columnDefs: [
          {
            headerName: '',
            field: 'expandableControl',
            colId: 'expandableControl',
            maxWidth: 50,
            cellRenderer: 'agGroupCellRenderer',
            valueGetter: expect.anything(),
          },
          {
            headerName: 'Existing Column 1',
            field: 'col1',
            colId: 'col1',
            valueGetter: expect.anything(),
          },
        ],
        rowData: mockData,
        fullWidthCellRenderer: 'fullWidthCellRenderer',
        detailCellRenderer: 'detailCellRenderer',
      })
    );
  });
});
