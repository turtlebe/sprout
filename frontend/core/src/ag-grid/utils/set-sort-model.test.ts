import { ColumnApi } from '@ag-grid-community/all-modules';

import { SortModel } from '../types';

import { setSortModel } from '.';

const mockApplyColumnState = jest.fn();

// @ts-ignore
const mockColumnApi: ColumnApi = {
  applyColumnState: mockApplyColumnState,
};

describe('setSortModel', () => {
  beforeEach(() => {
    mockApplyColumnState.mockClear();
  });

  it('sets empty array for column state when sortModel is undefined', () => {
    setSortModel(undefined, mockColumnApi);

    expect(mockApplyColumnState).toHaveBeenCalledWith({
      state: [],
      defaultState: { sort: null },
    });
  });

  it('sets column state from given sortModel', () => {
    const mockSortModel: SortModel = [
      { colId: '1', sort: 'asc' },
      { colId: '2', sort: 'asc' },
    ];

    setSortModel(mockSortModel, mockColumnApi);

    expect(mockApplyColumnState).toHaveBeenCalledWith({
      state: mockSortModel.map((item, index) => ({ ...item, sortIndex: index })),
      defaultState: { sort: null },
    });
  });
});
