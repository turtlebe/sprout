import {
  mockPackagingLot,
  mockPackagingLotWithHold,
  mockPackagingLotWithOverride,
  mockPackagingLotWithReleaseDetails,
  mockPackagingLotWithReleaseDetailsAndHold,
  mockPackagingLotWithReleaseDetailsAndHoldOverride,
  mockReleasedPackagingLot,
  mockReleasedPackagingLotWithReleaseDetails,
} from '@plentyag/core/src/test-helpers/mocks';

import { mockSku, mockSkuB10 } from '../../test-helpers/mock-skus';
import { FinishedGoodsStatus } from '../../types';

import { getStatus } from '.';

describe('getStatus', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('lot level', () => {
    it.each([
      [FinishedGoodsStatus.EXPIRED, '', { lot: mockPackagingLot, date: new Date('2022-12-12') }],
      [FinishedGoodsStatus.RELEASED, '', { lot: mockReleasedPackagingLot, date: new Date('2019-01-01') }],
      [FinishedGoodsStatus.UNRELEASED, '', { lot: mockPackagingLot, date: new Date('2019-01-01') }],
      [FinishedGoodsStatus.HOLD, '', { lot: mockPackagingLotWithOverride, date: new Date('2019-01-01') }],
      [FinishedGoodsStatus.HOLD, 'without overrides', { lot: mockPackagingLotWithHold, date: new Date('2019-01-01') }],
      [
        FinishedGoodsStatus.EXPIRED,
        'when already expired even if on HOLD',
        { lot: mockPackagingLotWithOverride, date: new Date('2022-12-12') },
      ],
    ])('should show appropriate %s status %s', (status, _additionalMsg, { lot, date }) => {
      // ARRANGE
      jest.setSystemTime(date);

      // ACT
      const result = getStatus(lot, mockSku);

      // ASSERT
      expect(result).toEqual(status);
    });
  });

  describe('sku level', () => {
    it.each([
      [FinishedGoodsStatus.EXPIRED, '', { lot: mockPackagingLotWithReleaseDetails, date: new Date('2022-12-12') }],
      [
        FinishedGoodsStatus.RELEASED,
        '',
        { lot: mockReleasedPackagingLotWithReleaseDetails, date: new Date('2019-01-01') },
      ],
      [FinishedGoodsStatus.UNRELEASED, '', { lot: mockPackagingLotWithReleaseDetails, date: new Date('2019-01-01') }],
      [
        FinishedGoodsStatus.HOLD,
        '',
        { lot: mockPackagingLotWithReleaseDetailsAndHoldOverride, date: new Date('2019-01-01') },
      ],
      [
        FinishedGoodsStatus.HOLD,
        'without overrides',
        { lot: mockPackagingLotWithReleaseDetailsAndHold, date: new Date('2019-01-01') },
      ],
      [
        FinishedGoodsStatus.EXPIRED,
        'when already expired even if on HOLD',
        { lot: mockPackagingLotWithOverride, date: new Date('2022-12-12') },
      ],
    ])('should show appropriate %s status %s', (status, _additionalMsg, { lot, date }) => {
      // ARRANGE
      jest.setSystemTime(date);

      // ACT
      const result = getStatus(lot, mockSkuB10, true);

      // ASSERT
      expect(result).toEqual(status);
    });
  });
});
