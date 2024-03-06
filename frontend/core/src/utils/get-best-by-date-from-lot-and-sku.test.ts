import { DateTime } from 'luxon';

import { mockPackagingLot, mockSku } from '../test-helpers/mocks';

import { getBestByDateFromLotAndSku } from '.';

describe('getBestByDateFromLotAndSku', () => {
  it('returns expiration date', () => {
    // ARRANGE
    const packDateTime = DateTime.fromSQL(mockPackagingLot.properties.packDate);

    // ACT
    const result = getBestByDateFromLotAndSku(mockPackagingLot, mockSku);

    // ASSERT
    expect(DateTime.fromJSDate(result).diff(packDateTime, 'days').days).toEqual(14);
  });
});
