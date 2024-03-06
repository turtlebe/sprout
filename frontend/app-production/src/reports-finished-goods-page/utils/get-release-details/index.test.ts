import { mockSku, mockSkuB10 } from '@plentyag/core/src/test-helpers/mocks';
import { PackagingLotTestStatus } from '@plentyag/core/src/types';

import {
  mockPackagingLotWithOverride,
  mockPackagingLotWithReleaseDetailsOverride,
} from '../../test-helpers/mock-packaging-lots';

import { getReleaseDetails } from '.';

describe('getReleaseDetails', () => {
  it('gets release details of a specified lot and sku', () => {
    // ACT
    const result = getReleaseDetails(mockPackagingLotWithReleaseDetailsOverride, mockSku);

    // ASSERT
    expect(result).toEqual({
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
  });

  it('gets release details of a specified lot (no sku passed)', () => {
    // ACT
    const result = getReleaseDetails(mockPackagingLotWithOverride);

    // ASSERT
    expect(result).toEqual({
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
  });

  it('returns empty object if sku is specified but is not found in properties', () => {
    // ACT
    const result = getReleaseDetails(mockPackagingLotWithReleaseDetailsOverride, mockSkuB10);

    // ASSERT
    expect(result).toEqual({
      passedLtStatus: PackagingLotTestStatus.NONE,
      passedQaStatus: PackagingLotTestStatus.NONE,
      overriddenLtStatus: PackagingLotTestStatus.NONE,
      overriddenQaStatus: PackagingLotTestStatus.NONE,
    });
  });

  it('returns null if there are no properties in a packaging lot', () => {
    // ACT
    const result1 = getReleaseDetails(undefined);
    const result2 = getReleaseDetails({ noProps: false } as any);

    // ASSERT
    expect(result1).toBeNull();
    expect(result2).toBeNull();
  });
});
