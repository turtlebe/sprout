import { act, renderHook } from '@testing-library/react-hooks';

import { mockWorkbinTaskDefinitionData } from '../../test-helpers';
import { WorkbinTaskDefinition } from '../../types';

import { useGetSelectedTableTaskDefinition } from '.';

const initialSelectedRowIndex = 1;
const mockgridReadyEvent = {
  api: {
    getSelectedRows: () => [{ id: mockWorkbinTaskDefinitionData[initialSelectedRowIndex].id }],
  },
};

describe('useGetSelectedTableTaskDefinition', () => {
  it('updates seletedRow when updateSelectedRow is called', () => {
    const { result, rerender } = renderHook(
      ({ gridReadyEvent }) =>
        useGetSelectedTableTaskDefinition<WorkbinTaskDefinition>(gridReadyEvent, mockWorkbinTaskDefinitionData),
      {
        initialProps: { gridReadyEvent: mockgridReadyEvent },
      }
    );

    expect(result.current.selectedTaskDefinition).toBe(mockWorkbinTaskDefinitionData[initialSelectedRowIndex]);
    // We switch from 1 to 0
    const newSelectedRowIndex = 0;
    const newMockgridReadyEvent = {
      api: {
        getSelectedRows: () => [{ id: mockWorkbinTaskDefinitionData[newSelectedRowIndex].id }],
      },
    };

    rerender({ gridReadyEvent: newMockgridReadyEvent });
    act(() => result.current.updateSelectedRow());
    expect(result.current.selectedTaskDefinition).toBe(mockWorkbinTaskDefinitionData[newSelectedRowIndex]);
  });

  it('changes selectedRow when tableRows changes', () => {
    const { result, rerender } = renderHook(
      ({ tableRows }) => useGetSelectedTableTaskDefinition<WorkbinTaskDefinition>(mockgridReadyEvent, tableRows),
      {
        initialProps: { tableRows: mockWorkbinTaskDefinitionData },
      }
    );

    expect(result.current.selectedTaskDefinition).toBe(mockWorkbinTaskDefinitionData[initialSelectedRowIndex]);

    // rows change and selected row is no longer in table, so selected row should be null.
    const newMockWorkbinTaskDefinitionData = [mockWorkbinTaskDefinitionData[0]];
    rerender({ tableRows: newMockWorkbinTaskDefinitionData });
    expect(result.current.selectedTaskDefinition).toBe(null);
  });
});
