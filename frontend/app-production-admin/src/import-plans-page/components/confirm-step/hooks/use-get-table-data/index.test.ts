import { mockUploadBulkCreateTasks } from '@plentyag/app-production-admin/src/import-plans-page/test-helpers/mock-workcenter-tasks';
import { renderHook } from '@testing-library/react-hooks';

import { useGetTableData } from '.';

describe('useGetTableData', () => {
  it('returns workcenter tasks import data grouped correctly by date/workcenter/tasks', () => {
    const { result } = renderHook(() => useGetTableData(mockUploadBulkCreateTasks));

    expect(result.current).toHaveLength(6);

    expect(result.current[0].plannedDate).toEqual('2042-07-21 00:00:00');
    expect(result.current[0].workcenter).toEqual('Seed');
    expect(result.current[0].task).toEqual('SeedTraysAndLoadTableToGerm');
    expect(result.current[0].tasks).toHaveLength(2);

    expect(result.current[1].plannedDate).toEqual('2042-07-22 00:00:00');
    expect(result.current[1].workcenter).toEqual('PropLoad');
    expect(result.current[1].task).toEqual('LoadTableIntoPropFromCleanTableStack');
    expect(result.current[1].tasks).toHaveLength(2);

    expect(result.current[2].plannedDate).toEqual('2042-07-22 00:00:00');
    expect(result.current[2].workcenter).toEqual('PropLoad');
    expect(result.current[2].task).toEqual('LoadTableIntoPropFromGerm');
    expect(result.current[2].tasks).toHaveLength(2);

    expect(result.current[3].plannedDate).toEqual('2042-07-22 00:00:00');
    expect(result.current[3].workcenter).toEqual('Seed');
    expect(result.current[3].task).toEqual('SeedTraysAndLoadTableToGerm');
    expect(result.current[3].tasks).toHaveLength(2);

    expect(result.current[4].plannedDate).toEqual('2042-07-23 00:00:00');
    expect(result.current[4].workcenter).toEqual('PropLoad');
    expect(result.current[4].task).toEqual('LoadTableIntoPropFromCleanTableStack');
    expect(result.current[4].tasks).toHaveLength(2);

    expect(result.current[5].plannedDate).toEqual('2042-07-23 00:00:00');
    expect(result.current[5].workcenter).toEqual('PropLoad');
    expect(result.current[5].task).toEqual('LoadTableIntoPropFromGerm');
    expect(result.current[5].tasks).toHaveLength(2);
  });

  it('returns empty array if given data is undefined', () => {
    const { result } = renderHook(() => useGetTableData(undefined));

    expect(result.current).toHaveLength(0);
  });
});
