import { IGetRowsParams } from '@ag-grid-community/all-modules';
import useCoreStore from '@plentyag/core/src/core-store';
import { cleanup, render, waitFor } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Router } from 'react-router-dom';

import { getSavedFilterState, getStorageKey } from '../../hooks/use-save-restore-grid-state';
import { ResetGridOptions } from '../../interface-types';

import { Table, TableProps } from '.';

jest.mock('@plentyag/core/src/core-store');

(useCoreStore as jest.Mock).mockReturnValue([
  {
    currentUser: 'test-user',
  },
  {},
]);

const columnDefs: LT.ColumnDef = [
  {
    colId: 'created',
    headerName: 'created',
    field: 'created',
    filter: true,
    sortable: true,
  },
  {
    colId: 'notes',
    headerName: 'notes',
    field: 'notes',
    filter: true,
    sortable: true,
  },
];

const rowData: LT.RowData[] = [
  {
    created: '1',
    notes: 'xyz',
  },
  {
    created: '2',
    notes: 'abc',
  },
];

async function waitForGridToInit({
  columnDefs,
  rowData,
  sampleIdQueryParameter,
  onRowSelected,
}: {
  columnDefs: LT.ColumnDef;
  rowData: LT.RowData[];
  sampleIdQueryParameter?: string;
  onRowSelected?: TableProps['onRowsSelected'];
}) {
  function getRowData(params: IGetRowsParams) {
    // mock filter on 'notes' column
    if (params.filterModel && params.filterModel['notes']) {
      const filter = params.filterModel['notes'].filter;
      const filteredData = rowData.filter(item => item.notes === filter);
      params.successCallback(filteredData, filteredData.length);
      return;
    }

    // mock sort on 'notes' column
    if (params.sortModel && params.sortModel) {
      const notesSortModel = params.sortModel.find(model => model.colId === 'notes');
      if (notesSortModel) {
        const sortedData = rowData.sort((a, b) => {
          var notesA = notesSortModel.sort === 'asc' ? a.notes : b.notes;
          var notesB = notesSortModel.sort === 'asc' ? b.notes : a.notes;
          if (notesA < notesB) {
            return -1;
          }
          if (notesA > notesB) {
            return 1;
          }
          // names must be equal
          return 0;
        });
        params.successCallback(sortedData, sortedData.length);
      }
    }

    params.successCallback(rowData, rowData.length);
  }

  let tableApi: LT.TableApi;
  function onTableReady(_tableApi: LT.TableApi) {
    _tableApi.gridApi.setDatasource({ getRows: getRowData });
    function onModelUpdated() {
      tableApi = _tableApi;
      _tableApi.gridApi.removeEventListener('modelUpdate', onModelUpdated);
    }
    _tableApi.gridApi.addEventListener('modelUpdated', onModelUpdated);
  }

  const queryParameter = sampleIdQueryParameter ? `?lab_test_sample_id=${sampleIdQueryParameter}` : '';
  const path = '/lab-testing' + queryParameter;

  const history = createMemoryHistory({ initialEntries: [path] });

  const wrapper = ({ children }) => <Router history={history}>{children}</Router>;

  const table = render(
    <Table
      columnDefs={columnDefs}
      uniqueFieldName="created"
      onTableReady={onTableReady}
      onRowsSelected={onRowSelected}
    />,
    { wrapper }
  );

  await waitFor(() => expect(tableApi).toBeTruthy());

  // @ts-ignore
  return { table, tableApi };
}

class MockLocalStorage {
  private readonly storage: any = {};
  public getItem(key) {
    return this.storage[key];
  }

  public setItem(key, value) {
    this.storage[key] = value;
  }
}

describe('Table', () => {
  let originalLocalStorage;

  beforeEach(() => {
    // save original version of local storage so we don't infer with other tests
    // and create our own instance for each test - also so test don't infer.
    originalLocalStorage = localStorage;
    Object.defineProperty(window, 'localStorage', {
      writable: true,
      value: new MockLocalStorage(),
    });
  });

  afterEach(() => {
    cleanup();
    Object.defineProperty(window, 'localStorage', { writable: true, value: originalLocalStorage });
  });

  it('has two rows of data', async () => {
    const { tableApi } = await waitForGridToInit({ columnDefs, rowData });
    const model = tableApi.gridApi.getModel();
    expect(model.getRowCount()).toBe(2);
  });

  // test for bug: https://plentyag.atlassian.net/browse/SD-7257
  it('adding new column should not change existing column ids', async () => {
    const { table, tableApi } = await waitForGridToInit({ columnDefs, rowData });

    const initColIds = tableApi.columnApi.getColumnState().map(state => state.colId);

    // add new column 'lab'
    const _columnDefs: LT.ColumnDef = [
      {
        colId: 'lab',
        headerName: 'lab',
        field: 'lab',
        sortable: true,
      },
      {
        colId: 'created',
        headerName: 'created',
        field: 'created',
        sortable: true,
      },
      { colId: 'notes', headerName: 'notes', field: 'notes', sortable: true },
    ];

    table.rerender(<Table uniqueFieldName="created" columnDefs={_columnDefs} />);

    await waitFor(() => expect(tableApi.columnApi.getColumnState()).toHaveLength(3));

    const finalColsIds = tableApi.columnApi.getColumnState().map(state => state.colId);

    // removing dups should only leave new column id: lab
    const newColIds = finalColsIds.filter(finalId => !initColIds.includes(finalId));
    expect(newColIds).toHaveLength(1);
    expect(newColIds[0]).toBe('lab');
  });

  describe('reset grid tests', () => {
    async function useSetupTableStateForResetTest() {
      const { table, tableApi } = await waitForGridToInit({ columnDefs, rowData });
      const state = useCoreStore()[0];

      const initialCols = tableApi.columnApi.getColumnState();

      const spyOnSaveState = jest.spyOn(localStorage, 'setItem');

      // change size of column 1
      const changeToWidth = 200;
      tableApi.columnApi.setColumnWidth(initialCols[0].colId, changeToWidth);
      const newCols = tableApi.columnApi.getColumnState();
      expect(newCols[0].width).toBe(changeToWidth);

      await waitFor(() => expect(spyOnSaveState).toHaveBeenCalledTimes(1));
      spyOnSaveState.mockClear();

      // should only be two rows of data displayed - before filter is applied below.
      expect(tableApi.gridApi.getDisplayedRowCount()).toBe(2);

      // add filter on col 2 - only one row should be displayed.
      const filterModel = { notes: { filterType: 'text', type: 'contains', filter: 'abc' } };
      tableApi.gridApi.setFilterModel(filterModel);

      // should only be one row - since filter is applied.
      await waitFor(() => expect(tableApi.gridApi.getDisplayedRowCount()).toBe(1));

      // change order of columns 0 and 1
      tableApi.columnApi.moveColumnByIndex(0, 1);
      const newcolsState = tableApi.columnApi.getColumnState();
      expect(newcolsState[0].colId).toBe(initialCols[1].colId);
      expect(newcolsState[1].colId).toBe(initialCols[0].colId);

      // changing column data will cause state to saved, wait for it.
      await waitFor(() => expect(spyOnSaveState).toHaveBeenCalledTimes(1));
      spyOnSaveState.mockClear();

      const storedState = state.currentUser && localStorage.getItem(getStorageKey(state.currentUser));
      if (!storedState) {
        fail();
      }
      const savedState = JSON.parse(storedState);
      expect(savedState.filterState).toEqual(filterModel);
      expect(savedState.colState[1].width).toBe(changeToWidth);
      expect(savedState.colState[0].colId).toBe(initialCols[1].colId);
      expect(savedState.colState[1].colId).toBe(initialCols[0].colId);

      return { table, tableApi, initialCols, changeToWidth };
    }

    it('reset "Column Order/Size" goes back to initial column width and order but does not impact filters', async () => {
      const { tableApi, initialCols } = await useSetupTableStateForResetTest();

      tableApi.resetGrid(ResetGridOptions.COLUMNS_ORDER_SIZE);

      await waitFor(() => {
        const finalCols = tableApi.columnApi.getColumnState();
        expect(finalCols[0].width).toBe(initialCols[0].width);
      });

      const finalCols = tableApi.columnApi.getColumnState();
      expect(finalCols[0].colId).toBe(initialCols[0].colId);
      expect(finalCols[1].colId).toBe(initialCols[1].colId);
    });

    it('reset "Column Order/Size" should not effect newly added columns - they should be tacked onto the end', async () => {
      const { table, tableApi, initialCols } = await useSetupTableStateForResetTest();

      // add new column 'lab'
      const _columnDefs: LT.ColumnDef = [
        {
          colId: 'lab',
          headerName: 'lab',
          field: 'lab',
          sortable: true,
        },
        {
          colId: 'created',
          headerName: 'created',
          field: 'created',
          sortable: true,
        },
        { colId: 'notes', headerName: 'notes', field: 'notes', sortable: true },
      ];

      table.rerender(<Table uniqueFieldName="created" columnDefs={_columnDefs} />);

      tableApi.resetGrid(ResetGridOptions.COLUMNS_ORDER_SIZE);

      await waitFor(() => {
        const colState = tableApi.columnApi.getColumnState();
        expect(colState[0].colId).toBe(initialCols[0].colId);
      });
      const colState = tableApi.columnApi.getColumnState();
      expect(colState[1].colId).toBe(initialCols[1].colId);
      expect(colState[2].colId).toBe('lab');
    });

    it('reset "Filters" removes filter but does not impact column order or size', async () => {
      const { tableApi, initialCols, changeToWidth } = await useSetupTableStateForResetTest();

      tableApi.resetGrid(ResetGridOptions.FILTERS);

      // no filters should be applied anymore, so both rows should be displayed
      await waitFor(() => expect(tableApi.gridApi.getDisplayedRowCount()).toBe(rowData.length));

      // column order and size should not be changed by reset.
      await waitFor(() => {
        const colState = tableApi.columnApi.getColumnState();
        expect(colState[1].colId).toBe(initialCols[0].colId);
      });
      const colState = tableApi.columnApi.getColumnState();
      expect(colState[1].width).toBe(changeToWidth);
    });

    it('reset "All" goes back to initial filters and column size/order', async () => {
      const { tableApi, initialCols } = await useSetupTableStateForResetTest();

      tableApi.resetGrid(ResetGridOptions.ALL);

      // no filters should be applied anymore, so both rows should be displayed
      await waitFor(() => expect(tableApi.gridApi.getDisplayedRowCount()).toBe(rowData.length));

      // column 1 should be original width and id.
      await waitFor(() => {
        const colState = tableApi.columnApi.getColumnState();
        expect(colState[0].colId).toBe(initialCols[0].colId);
      });
      const colState = tableApi.columnApi.getColumnState();
      expect(colState[0].width).toBe(initialCols[0].width);
    });
  });

  describe('selection tests', () => {
    it('invokes selection callback when rows are selected', async () => {
      const mockOnSelected = jest.fn();
      const { tableApi } = await waitForGridToInit({
        columnDefs,
        rowData,
        sampleIdQueryParameter: '',
        onRowSelected: mockOnSelected,
      });

      const node = tableApi.gridApi.getRowNode('1');
      node.setSelected(true, true);

      await waitFor(() => expect(mockOnSelected).toHaveBeenCalledTimes(1));
    });

    it('has no selected items after calling clearSelection method', async () => {
      const mockOnSelected = jest.fn();
      const { tableApi } = await waitForGridToInit({
        columnDefs,
        rowData,
        sampleIdQueryParameter: '',
        onRowSelected: mockOnSelected,
      });

      const node = tableApi.gridApi.getRowNode('1');
      node.setSelected(true, true);

      await waitFor(() => expect(mockOnSelected).toHaveBeenCalledTimes(1));
      mockOnSelected.mockReset();

      tableApi.clearSelection();
      await waitFor(() => expect(mockOnSelected).toHaveBeenCalledTimes(1));
      expect(mockOnSelected).toHaveBeenCalledWith([]);
    });

    it('gives selected in displayed order rather than the order selected', async () => {
      const mockOnSelected = jest.fn();
      const { tableApi } = await waitForGridToInit({
        columnDefs,
        rowData,
        sampleIdQueryParameter: '',
        onRowSelected: mockOnSelected,
      });

      // note: "created" column is unique field id in tests here.

      // select the 2nd row first (created=2)
      const node2 = tableApi.gridApi.getRowNode('2');
      node2.setSelected(true, false);

      // now select the first row.
      const node1 = tableApi.gridApi.getRowNode('1');
      node1.setSelected(true, false);

      await waitFor(() => expect(mockOnSelected).toHaveBeenCalledTimes(2));

      // the order in the callback should be the order displayed.
      expect(mockOnSelected).toHaveBeenLastCalledWith([node1, node2]);
    });
  });

  describe('save and restore column state tests', () => {
    it('restore saved column state from localStorage', async () => {
      const state = useCoreStore()[0];
      const col1Width = 300;
      const col2Width = 50;
      const savedState = {
        ver: 2,
        colState: [
          {
            colId: 'created',
            width: col1Width,
            pinned: false,
          },
          { colId: 'notes', width: col2Width, pinned: false },
        ],
        sortState: [],
        filterState: {},
      };
      state.currentUser && localStorage.setItem(getStorageKey(state.currentUser), JSON.stringify(savedState));

      const { tableApi } = await waitForGridToInit({ columnDefs, rowData });
      const cols = tableApi.columnApi.getAllColumns();
      expect(cols[0].getActualWidth()).toBe(col1Width);
      expect(cols[1].getActualWidth()).toBe(col2Width);
    });

    it('restore saved filter state from localStorage', async () => {
      const state = useCoreStore()[0];
      const savedState = {
        ver: 2,
        colState: [
          {
            colId: 'created',
            width: 50,
            pinned: false,
          },
          { colId: 'notes', width: 50, pinned: false },
        ],
        sortState: [],
        filterState: {
          notes: { filterType: 'text', type: 'contains', filter: 'abc' },
        },
      };
      state.currentUser && localStorage.setItem(getStorageKey(state.currentUser), JSON.stringify(savedState));

      const { tableApi } = await waitForGridToInit({ columnDefs, rowData });
      await waitFor(() => expect(tableApi.gridApi.getDisplayedRowCount()).toBe(1));
    });

    it('restore saved sort state from localStorage', async () => {
      const state = useCoreStore()[0];
      const savedState = {
        ver: 2,
        colState: [
          {
            colId: 'created',
            width: 50,
            pinned: false,
          },
          { colId: 'notes', width: 50, pinned: false },
        ],
        sortState: [{ colId: 'notes', sort: 'asc' }],
        filterState: {},
      };
      state.currentUser && localStorage.setItem(getStorageKey(state.currentUser), JSON.stringify(savedState));
      const { tableApi } = await waitForGridToInit({ columnDefs, rowData });
      await waitFor(() => expect(tableApi.gridApi.getDisplayedRowCount()).toBe(2));
      const row1Data = tableApi.gridApi.getDisplayedRowAtIndex(0);
      expect(row1Data.data['notes']).toBe('abc');
    });

    it('save column changes to localStorage', async () => {
      const state = useCoreStore()[0];
      const { tableApi } = await waitForGridToInit({ columnDefs, rowData });

      const initialCols = tableApi.columnApi.getAllColumns();

      const spyOnSaveState = jest.spyOn(localStorage, 'setItem');

      const changeToWidth = 256;
      tableApi.columnApi.setColumnWidth(initialCols[0], changeToWidth);

      // setting column width will cause state to saved, wait for it.
      await waitFor(() => expect(spyOnSaveState).toHaveBeenCalledTimes(1));

      const savedItem = state.currentUser && localStorage.getItem(getStorageKey(state.currentUser));
      if (!savedItem) {
        fail();
      }
      const savedState = JSON.parse(savedItem);
      expect(savedState.colState[0].width).toBe(changeToWidth);
    });

    it('getSavedFilterState should contain save filter state', async () => {
      const state = useCoreStore()[0];

      const { tableApi } = await waitForGridToInit({ columnDefs, rowData });
      const spyOnSaveState = jest.spyOn(localStorage, 'setItem');
      const filterModel = { notes: { filterType: 'text', type: 'contains', filter: 'abc' } };
      tableApi.gridApi.setFilterModel(filterModel);

      await waitFor(() => expect(spyOnSaveState).toHaveBeenCalledTimes(1));

      const savedFilterState = state.currentUser && getSavedFilterState(state.currentUser);
      expect(savedFilterState).toEqual(filterModel);
    });

    it('ignores localStorage filterState when sample id query parameter present', async () => {
      const state = useCoreStore()[0];
      const savedState = {
        ver: 2,
        colState: [
          {
            colId: 'created',
            width: 50,
            pinned: false,
          },
          { colId: 'notes', width: 50, pinned: false },
        ],
        sortState: [],
        filterState: {
          notes: { filterType: 'text', type: 'contains', filter: 'abc' },
        },
      };
      state.currentUser && localStorage.setItem(getStorageKey(state.currentUser), JSON.stringify(savedState));

      // query parameter should override filterState, so that filterState is ignored.
      const mockSampleIdQueryParameter = 'id1234';
      const { tableApi } = await waitForGridToInit({
        columnDefs,
        rowData,
        sampleIdQueryParameter: mockSampleIdQueryParameter,
      });

      // no filter should be applied, so both rows of data should appear.
      await waitFor(() => expect(tableApi.gridApi.getDisplayedRowCount()).toBe(2));
    });

    it('does not save changes to local storage when sample id query parameter present', async () => {
      const mockSampleIdQueryParameter = 'id1234';
      const { tableApi } = await waitForGridToInit({
        columnDefs,
        rowData,
        sampleIdQueryParameter: mockSampleIdQueryParameter,
      });

      const initialCols = tableApi.columnApi.getAllColumns();

      const spyOnSaveState = jest.spyOn(localStorage, 'setItem');

      const changeToWidth = 256;
      tableApi.columnApi.setColumnWidth(initialCols[0], changeToWidth);

      // setting column width will NOT cause state to be saved when sample id query parameter is present.
      await waitFor(() => expect(spyOnSaveState).not.toHaveBeenCalled());
    });
  });
});
