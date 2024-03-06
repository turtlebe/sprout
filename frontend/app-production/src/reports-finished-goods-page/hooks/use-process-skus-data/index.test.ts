import { mockSku, mockSkus } from '@plentyag/core/src/test-helpers/mocks';
import { mockFinishedGoodsCases } from '@plentyag/core/src/test-helpers/mocks/finished-good-cases';
import { renderHook } from '@testing-library/react-hooks';
import { Settings } from 'luxon';

import { mockCrop, mockCrops } from '../../test-helpers/mock-crops';
import {
  mockPackagingLotWithReleaseDetails,
  mockPackagingLotWithReleaseDetailsOverride,
} from '../../test-helpers/mock-packaging-lots';

import { useProcessSkusData } from '.';

describe('useProcessSkusData', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2042-12-12'));
    Settings.defaultZone = 'America/Los_Angeles';
  });

  afterAll(() => {
    jest.useRealTimers();
    Settings.defaultZone = 'system';
  });

  it('returns aggregated data for skus', () => {
    // ARRANGE
    const finishedGoodsData = {
      lots: [mockPackagingLotWithReleaseDetails, mockPackagingLotWithReleaseDetailsOverride],
      crops: mockCrops,
      cases: mockFinishedGoodsCases,
      skus: mockSkus,
    };

    // ACT
    const { result } = renderHook(() => useProcessSkusData({ finishedGoodsData }));

    // ASSERT
    expect(result.current).toHaveLength(2);

    expect(result.current[0].lot).toEqual(mockPackagingLotWithReleaseDetailsOverride);
    expect(result.current[0].sku).toEqual(mockSku);
    expect(result.current[0].count).toEqual(0);
    expect(result.current[0].crop).toEqual(mockCrop);
    expect(result.current[0].status).toEqual('expired');
    expect(result.current[0].expDate).toEqual(new Date('2022-09-16T07:00:00.000Z'));
    expect(result.current[0].releaseDetails).toEqual({
      overriddenLtAuthor: 'otapia',
      overriddenLtNotes:
        'Testing lab test long string in the notes section to see how is the behavior in the UI in toggle view',
      overriddenLtStatus: 'FAIL',
      overriddenLtUpdatedAt: '2022-09-02T13:12:37.587Z',
      overriddenQaAuthor: 'otapia',
      overriddenQaNotes:
        'Testing QA long string in the notes section to see how is the behavior in the UI in toggle view',
      overriddenQaStatus: 'HOLD',
      overriddenQaUpdatedAt: '2022-09-02T13:12:23.751Z',
      passedLtStatus: 'NONE',
      passedQaStatus: 'NONE',
      releasedAt: null,
    });

    expect(result.current[1].lot).toEqual(mockPackagingLotWithReleaseDetails);
    expect(result.current[1].sku).toEqual(mockSku);
    expect(result.current[1].count).toEqual(1);
    expect(result.current[1].crop).toEqual(mockCrop);
    expect(result.current[1].status).toEqual('expired');
    expect(result.current[1].expDate).toEqual(new Date('2022-08-21T07:00:00.000Z'));
    expect(result.current[1].releaseDetails).toEqual({
      overriddenLtStatus: 'NONE',
      overriddenQaStatus: 'NONE',
      passedLtStatus: 'NONE',
      passedQaStatus: 'NONE',
      releasedAt: null,
    });
  });
});
