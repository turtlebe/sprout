import { getSortModelFromQueryParams, SORT_BY_KEY } from '.';

const mockColumnDefs: ColDef[] = [{ field: 'col1' }, { field: 'col2' }];

describe('getSortModelFromQueryParams', () => {
  it('returns an empty object when no sorting query parameters are present', () => {
    const queryParams = new URLSearchParams();
    queryParams.set('ignore', 'asc');

    expect(getSortModelFromQueryParams(queryParams, mockColumnDefs)).toEqual([]);
  });

  it('returns the SortModel object', () => {
    const queryParams = new URLSearchParams();
    queryParams.set(SORT_BY_KEY, 'col1');
    queryParams.set('order', 'desc');

    expect(getSortModelFromQueryParams(queryParams, mockColumnDefs)).toEqual([{ colId: 'col1', sort: 'desc' }]);
  });
});
