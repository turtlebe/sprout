import { GridApi } from '@ag-grid-community/core';
import { renderHook } from '@testing-library/react-hooks';

import { mockFinishedGoodsDataLots } from '../../test-helpers/mock-finished-goods-data';
import { FinishedGoodsStatus } from '../../types';

import { useGetFinishedGoodsCounts } from '.';

describe('useGetFinishedGoodsCounts', () => {
  let mockGridReadyEvent;

  beforeEach(() => {
    // mock "ag grid"
    const mockAgGridElement = document.createElement('mockaggrid');

    // mock "forEachNodeAfterFilter"
    (mockAgGridElement as unknown as GridApi).forEachNodeAfterFilter = jest.fn().mockImplementation(callback => {
      mockFinishedGoodsDataLots.forEach(lot => {
        callback({ data: lot });
      });
    });

    // mock ag grid ready event
    mockGridReadyEvent = {
      api: mockAgGridElement,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns counts', () => {
    // ACT
    const { result } = renderHook(() => useGetFinishedGoodsCounts(mockGridReadyEvent));

    // ASSERT
    expect(result.current.getCount(FinishedGoodsStatus.EXPIRED)).toEqual(2);
    expect(result.current.getCount(FinishedGoodsStatus.RELEASED)).toEqual(0);
    expect(result.current.getCount(FinishedGoodsStatus.UNRELEASED)).toEqual(0);
  });
});
