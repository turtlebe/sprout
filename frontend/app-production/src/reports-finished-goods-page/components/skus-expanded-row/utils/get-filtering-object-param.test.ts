import { getFilteringObjectParam } from './get-filtering-object-param';

describe('getFilteringObjectParam', () => {
  it('returns object param for ag-grid query params string with correct keyword', () => {
    // ACT
    const result = getFilteringObjectParam('testing123');

    // ASSERT
    expect(result).toEqual('filterType-text-*type-contains-*filter-testing123');
  });
});
