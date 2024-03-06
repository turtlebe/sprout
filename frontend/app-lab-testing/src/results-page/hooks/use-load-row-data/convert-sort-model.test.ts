import { cols } from '../../table-cols';

import { convertSortModelIntoQueryParameters } from './convert-sort-model';

describe('convertSortModelIntoQueryParameters()', () => {
  it('should give query parameter with ascending sort order', () => {
    const queryParm = convertSortModelIntoQueryParameters([
      {
        colId: cols.CREATED,
        sort: 'asc',
      },
    ]);

    expect(queryParm).toBe('start_time');
  });

  it('should give query parameter with ascending sort order', () => {
    const queryParm = convertSortModelIntoQueryParameters([
      {
        colId: cols.CREATED,
        sort: 'desc',
      },
    ]);

    expect(queryParm).toBe('-start_time');
  });

  it('should give multiple query parameters', () => {
    const queryParm = convertSortModelIntoQueryParameters([
      {
        colId: cols.CREATED,
        sort: 'desc',
      },
      {
        colId: cols.LAB,
        sort: 'asc',
      },
    ]);
    expect(queryParm).toBe('-start_time,lab_test_provider');
  });
});
