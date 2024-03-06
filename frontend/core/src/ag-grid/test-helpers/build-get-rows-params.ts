import { IGetRowsParams, IServerSideGetRowsParams } from '@ag-grid-community/all-modules';

export interface BuildGetRowsParamsProps {
  filters?: any;
  sortBy?: {
    [key: string]: 'asc' | 'desc';
  };
  startRow?: number;
}

/**
 * Builds and mock an AgGrid IDatasource.getRows() object with its associated AgGrid FilterModel, SortModel.
 *
 * @param {Object} props
 * @param {Object} props.filters Filters to apply to the FilterModel
 * @param {Object} props.sortBy Objects containing sorting information to apply to the SortModel
 * @param {Object} props.startRow A mock AgGrid startRow attribute
 * @return a mock object corresponding to IDatasource.getRows()
 */
export function buildGetRowsParams({ filters = {}, sortBy = {}, startRow }: BuildGetRowsParamsProps): IGetRowsParams {
  return {
    filterModel: { ...filters },
    sortModel: Object.keys(sortBy).map(key => ({ colId: key, sort: sortBy[key] })),
    startRow,
    successCallback: jest.fn(),
    failCallback: jest.fn(),
  } as unknown as IGetRowsParams;
}

export function buildServerSideGetRowsParams({
  filters = {},
  sortBy = {},
  startRow,
}: BuildGetRowsParamsProps): IServerSideGetRowsParams {
  return {
    request: {
      filterModel: { ...filters },
      sortModel: Object.keys(sortBy).map(key => ({ colId: key, sort: sortBy[key] })),
      startRow,
    },
    success: jest.fn(),
    fail: jest.fn(),
  } as unknown as IServerSideGetRowsParams;
}
