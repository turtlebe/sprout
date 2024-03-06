import { TaskType } from '@plentyag/app-production/src/maps-interactive-page/types';
import { renderHook } from '@testing-library/react-hooks';

import { buildIrrigationTask } from '../../../test-helpers/build-irrigation-task';

import { useFormGenConfig } from './use-form-gen-config';

describe('useFormGenConfig', () => {
  it('serializes the modified task', () => {
    const mockCreatedTask = buildIrrigationTask();
    const { result } = renderHook(() => useFormGenConfig({ rowData: mockCreatedTask, isUpdating: true }));

    const serializedTask = result.current.serialize({ volume: 100 });

    expect(serializedTask).toEqual({
      plannedVolume: 100,
      plannedDate: mockCreatedTask.irrigationDate.toISOString(),
      lotName: mockCreatedTask.lotName,
      tableSerial: mockCreatedTask.tableSerial,
      rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
    });
  });

  it('serializes the added task', () => {
    const mockCreatedTask = buildIrrigationTask();
    const { result } = renderHook(() => useFormGenConfig({ rowData: mockCreatedTask, isUpdating: false }));

    const serializedTask = result.current.serialize({ volume: 102 });

    expect(serializedTask).toEqual({
      plannedVolume: 102,
      plannedDate: mockCreatedTask.irrigationDate.toISOString(),
      lotName: mockCreatedTask.lotName,
      tableSerial: mockCreatedTask.tableSerial,
      rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1',
      taskType: TaskType.MANUAL,
    });
  });

  it('has correct default volume', () => {
    const mockCreatedTask = buildIrrigationTask();
    const { result } = renderHook(() => useFormGenConfig({ rowData: mockCreatedTask, isUpdating: false }));

    const volumeField = result.current.fields[0] as FormGen.FieldTextField;
    expect(volumeField.default).toEqual(mockCreatedTask.plannedVolume);
    expect(volumeField.name).toBe('volume');
  });
});
