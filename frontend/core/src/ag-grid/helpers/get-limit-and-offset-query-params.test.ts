import { DEFAULT_CACHE_BLOCK_SIZE } from '../constants';
import { buildServerSideGetRowsParams } from '../test-helpers/build-get-rows-params';

import { getLimitAndOffsetQueryParams } from '.';

describe('getLimitAndOffsetQueryParams', () => {
  it('uses the startRow as the offset', () => {
    const params = buildServerSideGetRowsParams({ startRow: 33 });
    expect(getLimitAndOffsetQueryParams(params.request)).toEqual({ limit: DEFAULT_CACHE_BLOCK_SIZE, offset: 33 });
  });
});
