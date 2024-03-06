import { buildGetRowsParams } from '../test-helpers/build-get-rows-params';

import { getSortingQueryParams, SORT_BY_KEY } from '.';

describe('getSortingQueryParams', () => {
  it('returns an empty object when no sorting is applied', () => {
    const params = buildGetRowsParams({});

    expect(getSortingQueryParams(params.sortModel, jest.fn())).toEqual({});
  });

  it('only sorts one column', () => {
    const params = buildGetRowsParams({ sortBy: { col1: 'asc', col2: 'desc' } });

    expect(getSortingQueryParams(params.sortModel, jest.fn())).toEqual({ [SORT_BY_KEY]: 'col1', order: 'asc' });
  });

  it('takes in account query parameters mapping', () => {
    const params = buildGetRowsParams({ sortBy: { col1: 'asc' } });

    expect(getSortingQueryParams(params.sortModel, () => 'colOne')).toEqual({
      [SORT_BY_KEY]: 'colOne',
      order: 'asc',
    });
  });

  it('ignores the mapping when the column is not mapped', () => {
    const params = buildGetRowsParams({ sortBy: { col2: 'asc' } });

    expect(getSortingQueryParams(params.sortModel, () => undefined)).toEqual({
      [SORT_BY_KEY]: 'col2',
      order: 'asc',
    });
  });
});
