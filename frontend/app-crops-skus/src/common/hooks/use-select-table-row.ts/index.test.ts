import { act, renderHook } from '@testing-library/react-hooks';

import { mockSkus } from '../../test-helpers';
import { SkuWithFarmInfo } from '../../types';

import { useSelectedTableRow } from '.';

const mockgridReadyEvent = {
  api: {
    getSelectedRows: () => [{ name: mockSkus[1].name }],
  },
};

describe('useSelectedTableRow', () => {
  it('seletedRow is updated when updateSelectedRow is called', () => {
    const { result, rerender } = renderHook(
      ({ gridReadyEvent }) => useSelectedTableRow<SkuWithFarmInfo>(gridReadyEvent, mockSkus),
      {
        initialProps: { gridReadyEvent: mockgridReadyEvent },
      }
    );

    expect(result.current.selectedRow).toBe(mockSkus[1]);

    const newMockgridReadyEvent = {
      api: {
        getSelectedRows: () => [{ name: mockSkus[0].name }],
      },
    };

    rerender({ gridReadyEvent: newMockgridReadyEvent });

    act(() => result.current.updateSelectedRow());

    expect(result.current.selectedRow).toBe(mockSkus[0]);
  });

  it('selectedRow is called when tableRows changes', () => {
    const { result, rerender } = renderHook(
      ({ tableRows }) => useSelectedTableRow<SkuWithFarmInfo>(mockgridReadyEvent, tableRows),
      {
        initialProps: { tableRows: mockSkus },
      }
    );

    expect(result.current.selectedRow).toBe(mockSkus[1]);

    // rows change and selected row is no longer in table, so selected row should be null.
    const newMockSkus = [mockSkus[0]];
    rerender({ tableRows: newMockSkus });

    expect(result.current.selectedRow).toBe(null);
  });
});
