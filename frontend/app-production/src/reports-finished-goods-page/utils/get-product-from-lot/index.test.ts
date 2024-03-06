import { mockConsoleError } from '@plentyag/core/src/test-helpers';
import { mockPackagingLot } from '@plentyag/core/src/test-helpers/mocks';

const consoleError = mockConsoleError();

import { getProductFromLot } from '.';

describe('getProductFromLot', () => {
  it('returns product from lot', () => {
    // ACT
    const result = getProductFromLot(mockPackagingLot);

    // ASSERT
    expect(result).toEqual('C11');
  });

  it.each([
    [null, ''],
    [undefined, ''],
    [{ ...mockPackagingLot, product: null }, mockPackagingLot.lotName],
  ])('throws error if passed through missing attributes to parse product: %s', (lot, lotName) => {
    // ACT
    getProductFromLot(lot);

    // ASSERT
    expect(consoleError).toHaveBeenCalledWith(`Product is not found for this lot ${lotName}`);
  });
});
