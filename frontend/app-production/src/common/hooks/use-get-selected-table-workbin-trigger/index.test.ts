import { act, renderHook } from '@testing-library/react-hooks';

import { mockWorkbinTriggerData } from '../../test-helpers';
import { WorkbinTaskTrigger } from '../../types';

import { useGetSelectedTableWorkbinTrigger } from '.';

const initialSelectedRowIndex = 1;
const mockgridReadyEvent = {
  api: {
    getSelectedRows: () => [{ groupId: mockWorkbinTriggerData[initialSelectedRowIndex].groupId }],
  },
};

describe('useGetSelectedTableWorkbinTrigger', () => {
  it('updates seletedRow when updateSelectedRow is called', () => {
    const { result, rerender } = renderHook(
      ({ gridReadyEvent }) =>
        useGetSelectedTableWorkbinTrigger<WorkbinTaskTrigger>(gridReadyEvent, mockWorkbinTriggerData),
      {
        initialProps: { gridReadyEvent: mockgridReadyEvent },
      }
    );

    expect(result.current.selectedWorkbinTrigger).toBe(mockWorkbinTriggerData[initialSelectedRowIndex]);
    // We switch from 1 to 0
    const newSelectedRowIndex = 0;
    const newMockgridReadyEvent = {
      api: {
        getSelectedRows: () => [{ groupId: mockWorkbinTriggerData[newSelectedRowIndex].groupId }],
      },
    };

    rerender({ gridReadyEvent: newMockgridReadyEvent });
    act(() => result.current.updateSelectedRow());
    expect(result.current.selectedWorkbinTrigger).toBe(mockWorkbinTriggerData[newSelectedRowIndex]);
  });

  it('changes selectedRow when tableRows changes', () => {
    const { result, rerender } = renderHook(
      ({ tableRows }) => useGetSelectedTableWorkbinTrigger<WorkbinTaskTrigger>(mockgridReadyEvent, tableRows),
      {
        initialProps: { tableRows: mockWorkbinTriggerData },
      }
    );

    expect(result.current.selectedWorkbinTrigger).toBe(mockWorkbinTriggerData[initialSelectedRowIndex]);

    // rows change and selected row is no longer in table, so selected row should be null.
    const newMockWorkbinTriggerData = [mockWorkbinTriggerData[0]];
    rerender({ tableRows: newMockWorkbinTriggerData });
    expect(result.current.selectedWorkbinTrigger).toBe(null);
  });
});
