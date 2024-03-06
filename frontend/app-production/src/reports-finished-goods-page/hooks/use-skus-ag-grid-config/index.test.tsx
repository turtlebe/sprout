import { renderHook } from '@testing-library/react-hooks';

import { mockFinishedGoodsDataSkus } from '../../test-helpers/mock-finished-goods-data';

import { useSkusAgGridConfig } from '.';

describe('useSkusAgGridConfig', () => {
  it('returns ag grid config without errors', () => {
    // ACT
    const { result } = renderHook(() => useSkusAgGridConfig({ finishedGoodsSkus: mockFinishedGoodsDataSkus }));

    // ASSERT
    expect(result.current).toEqual(
      expect.objectContaining({
        rowData: mockFinishedGoodsDataSkus,
        rowHeight: 48,
      })
    );
    expect(result.current.columnDefs[0].headerName).toEqual('');
    expect(result.current.columnDefs[1].headerName).toEqual('Status');
    expect(result.current.columnDefs[2].headerName).toEqual('Harvested');
    expect(result.current.columnDefs[3].headerName).toEqual('Packaging Lot');
    expect(result.current.columnDefs[4].headerName).toEqual('SKU');
    expect(result.current.columnDefs[5].headerName).toEqual('Count');
    expect(result.current.columnDefs[6].headerName).toEqual('Exp Date');
    expect(result.current.columnDefs[7].headerName).toEqual('Full Name');
    expect(result.current.columnDefs[8].headerName).toEqual('QA Status');
    expect(result.current.columnDefs[9].headerName).toEqual('Lab Testing');
  });

  it('returns a dash if there is an invalid exp date', () => {
    // ARRANGE
    const { result } = renderHook(() => useSkusAgGridConfig({ finishedGoodsSkus: mockFinishedGoodsDataSkus }));

    const row = {
      data: { ...mockFinishedGoodsDataSkus[0], expDate: null }, // null exp date
    };

    // ACT
    const expDateResult = (result.current.columnDefs[6] as any).valueGetter(row);

    // ASSERT
    expect(expDateResult).toEqual('-');
  });
});
