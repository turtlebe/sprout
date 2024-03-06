import { AppProductionTestWrapper } from '@plentyag/app-production/src/common/test-helpers';
import { mocktasks } from '@plentyag/app-production/src/reactors-and-tasks-detail-page/test-helpers';
import { renderHook } from '@testing-library/react-hooks';

import { useTasksAgGridConfig } from '.';

describe('useTasksAgGridConfig', () => {
  it('returns ag grid config without errors', () => {
    // ACT
    const { result } = renderHook(() => useTasksAgGridConfig(mocktasks), {
      wrapper: AppProductionTestWrapper,
    });

    // ASSERT
    expect(result.current).toEqual(
      expect.objectContaining({
        rowData: mocktasks,
        rowHeight: 48,
      })
    );
    expect(result.current.columnDefs[0].headerName).toEqual('Status');
    expect(result.current.columnDefs[1].headerName).toEqual('Date');
    expect(result.current.columnDefs[2].headerName).toEqual('Title');
    expect(result.current.columnDefs[3].headerName).toEqual('Type');
    expect(result.current.columnDefs[4].headerName).toEqual('Reactor');
    expect(result.current.columnDefs[5].headerName).toEqual('ID');
  });
});
