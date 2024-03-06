import {
  mockPackagingLot,
  mockPackagingLotWithOverride,
  mockPackagingLotWithReleaseDetailsOverride,
  mockSku,
} from '@plentyag/core/src/test-helpers/mocks';
import { renderHook } from '@testing-library/react-hooks';

import { TestStatusField } from '../../types';
import { getReleaseDetails } from '../../utils/get-release-details';

import { useFinishedGoodsTestStatusFormGenConfig } from '.';

describe('useFinishedGoodsTestStatusFormGenConfig', () => {
  function renderUseFinishedGoodsTestStatusFormGenConfig(lotName, field: TestStatusField) {
    return renderHook(() =>
      useFinishedGoodsTestStatusFormGenConfig({
        lotName,
        field,
        username: 'testuser',
      })
    );
  }

  beforeAll(() => {
    jest.useFakeTimers('modern');
    jest.setSystemTime(new Date('2020-04-01'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('returns correct values for QA', () => {
    // ACT
    const { result } = renderUseFinishedGoodsTestStatusFormGenConfig(mockPackagingLot.lotName, TestStatusField.QA);

    // ASSERT
    // -- title
    expect(result.current.title).toEqual('Edit QA Status for 5-LAX1-C11-219');
    // -- endpoint
    expect(result.current.updateEndpoint).toEqual(
      '/api/plentyservice/traceability3/update-packaging-lot-netsuite-status/5-LAX1-C11-219?status_type=SKU_QA_OVERRIDDEN'
    );
    // -- fields
    expect(result.current.fields).toHaveLength(3);
    expect((result.current.fields[0] as any).label).toEqual('User');
    expect((result.current.fields[1] as any).label).toEqual('Status');
    expect((result.current.fields[2] as any).label).toEqual('Notes');
  });

  it('returns correct values for Lab Testing', () => {
    // ACT
    const { result } = renderUseFinishedGoodsTestStatusFormGenConfig(
      mockPackagingLot.lotName,
      TestStatusField.LAB_TESTING
    );

    // ASSERT
    // -- title
    expect(result.current.title).toEqual('Edit Lab Testing Status for 5-LAX1-C11-219');
    // -- endpoint
    expect(result.current.updateEndpoint).toEqual(
      '/api/plentyservice/traceability3/update-packaging-lot-netsuite-status/5-LAX1-C11-219?status_type=SKU_LT_OVERRIDDEN'
    );
    // -- fields
    expect(result.current.fields).toHaveLength(3);
    expect((result.current.fields[0] as any).label).toEqual('User');
    expect((result.current.fields[1] as any).label).toEqual('Status');
    expect((result.current.fields[2] as any).label).toEqual('Notes');
  });

  it('deserializes to appropriate object (lot release)', () => {
    // ARRANGE
    const { result } = renderUseFinishedGoodsTestStatusFormGenConfig(
      mockPackagingLotWithOverride.lotName,
      TestStatusField.QA
    );
    const releaseDetails = getReleaseDetails(mockPackagingLotWithOverride);

    // ACT
    const deserializeResult = result.current.deserialize(releaseDetails);

    // ASSERT
    expect(deserializeResult).toEqual({
      status: 'HOLD',
      notes: 'Testing QA long string in the notes section to see how is the behavior in the UI in toggle view',
      username: 'testuser',
      lastUpdatedAt: '2022-09-02T13:12:23.751Z',
    });
  });

  it('deserializes to appropriate object (sku release)', () => {
    // ARRANGE
    const { result } = renderUseFinishedGoodsTestStatusFormGenConfig(
      mockPackagingLotWithOverride.lotName,
      TestStatusField.QA
    );
    const releaseDetails = getReleaseDetails(mockPackagingLotWithReleaseDetailsOverride, mockSku);

    // ACT
    const deserializeResult = result.current.deserialize(releaseDetails);

    // ASSERT
    expect(deserializeResult).toEqual({
      status: 'HOLD',
      notes: 'Testing QA long string in the notes section to see how is the behavior in the UI in toggle view',
      username: 'testuser',
      lastUpdatedAt: '2022-09-02T13:12:23.751Z',
    });
  });

  it('serializes to appropriate object', () => {
    // ARRANGE
    const { result } = renderUseFinishedGoodsTestStatusFormGenConfig(mockPackagingLot.lotName, TestStatusField.QA);

    // ACT
    const serializeResult = result.current.serialize({
      status: 'FAIL',
      notes: 'Test',
      username: 'testuser',
      lastUpdatedAt: '2022-04-16T12:00:00.000Z',
    });
    // ASSERT
    // -- check object
    expect(serializeResult).toEqual(
      expect.objectContaining({
        author: 'testuser',
        notes: 'Test',
        status: 'FAIL',
      })
    );
    // -- check updated time
    expect(serializeResult.updatedAt).toContain('2020-04-01');
  });
});
