import { ColumnApi, ColumnState } from '@ag-grid-community/all-modules';

import { getSortModel } from '.';

describe('getSortModel', () => {
  it('removes items that have no "sort"', () => {
    const mockColumnState: ColumnState[] = [
      {
        colId: 'col1',
        sortIndex: 1,
        sort: 'asc',
      },
      {
        colId: 'col2',
      },
      {
        colId: 'col3',
        sortIndex: 0,
        sort: 'desc',
      },
      {
        colId: 'col4',
        sort: undefined,
      },
      {
        colId: 'col5',
        sort: null,
      },
    ];

    // @ts-ignore
    const mockColumnApi: ColumnApi = {
      getColumnState: () => mockColumnState,
    };

    const sortModel = getSortModel(mockColumnApi);
    expect(sortModel).toHaveLength(2);
    expect(sortModel[0]).toEqual({ colId: 'col3', sort: 'desc' });
    expect(sortModel[1]).toEqual({ colId: 'col1', sort: 'asc' });
  });

  it('retuns items sorted by "sortIndex"', () => {
    const mockColumnState: ColumnState[] = [
      {
        colId: 'col1',
        sortIndex: 1,
        sort: 'asc',
      },
      {
        colId: 'col2',
        sortIndex: 2,
        sort: 'asc',
      },
      {
        colId: 'col3',
        sortIndex: 0,
        sort: 'desc',
      },
    ];

    // @ts-ignore
    const mockColumnApi: ColumnApi = {
      getColumnState: () => mockColumnState,
    };

    const sortModel = getSortModel(mockColumnApi);
    expect(sortModel).toHaveLength(3);
    expect(sortModel[0]).toEqual({ colId: 'col3', sort: 'desc' });
    expect(sortModel[1]).toEqual({ colId: 'col1', sort: 'asc' });
    expect(sortModel[2]).toEqual({ colId: 'col2', sort: 'asc' });
  });
});
