import { act, renderHook } from '@testing-library/react-hooks';
import { isEqual } from 'lodash';

import { useExtendedAgGridWithRowReorder } from '.';

describe('useExtendedAgGridWithRowReorder', () => {
  let mockOnRowReorder = jest.fn();

  // -- mock data
  const mockData = [
    {
      rowId: '123',
      message: 'hi',
    },
    {
      rowId: '456',
      message: 'bye',
    },
  ];

  afterEach(() => {
    mockOnRowReorder.mockReset();
  });

  function renderUseExtendedAgGridWithRowReorder() {
    return renderHook(() =>
      useExtendedAgGridWithRowReorder({
        agGridConfig: {
          columnDefs: [
            {
              headerName: 'Existing Column 1',
              field: 'col1',
              colId: 'col1',
              valueGetter: () => 'col 1',
            },
            {
              headerName: 'Existing Column 2',
              field: 'col2',
              colId: 'col2',
              valueGetter: () => 'col 2',
            },
          ],
          getRowNodeId: rowData => rowData.rowId,
          rowData: mockData,
        },
        onRowReorder: mockOnRowReorder,
      })
    );
  }

  it('extends existing AG Grid config with row reordering', () => {
    // ACT
    const { result } = renderUseExtendedAgGridWithRowReorder();

    // ASSERT
    // -- merged ag grid config
    expect(result.current).toEqual(
      expect.objectContaining({
        rowDragManaged: true,
        suppressMoveWhenRowDragging: true,
        animatedRows: true,
        getRowNodeId: expect.anything(),
        columnDefs: [
          {
            headerName: 'Existing Column 1',
            field: 'col1',
            colId: 'col1',
            valueGetter: expect.anything(),
            rowDrag: true,
          },
          {
            headerName: 'Existing Column 2',
            field: 'col2',
            colId: 'col2',
            valueGetter: expect.anything(),
          },
        ],
      })
    );
  });

  it('should set a copy the current data', () => {
    // ACT
    const { result } = renderUseExtendedAgGridWithRowReorder();

    // ASSERT
    expect(isEqual(result.current.rowData, mockData));
  });

  it('onRowDragEnd => should return ordered data after row drag event occured', () => {
    // ARRANGE
    const { result } = renderUseExtendedAgGridWithRowReorder();

    // -- mock move second node up to the beginning
    const mockParam = {
      overIndex: 0,
      node: {
        data: mockData[1],
        id: mockData[1].rowId,
      },
    };

    // ACT
    act(() => {
      result.current.onRowDragEnd(mockParam as any);
    });

    // ASSERT
    // -- reversed order
    expect(mockOnRowReorder).toHaveBeenCalledWith(mockParam, [
      { message: 'bye', rowId: '456' },
      { message: 'hi', rowId: '123' },
    ]);
  });
});
