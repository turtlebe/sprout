import { IrrigationStatus, TaskType } from '@plentyag/app-production/src/maps-interactive-page/types';

import { IrrigationTaskTableRowData } from '../types';

export function buildIrrigationTask({
  status,
  irrigationDate,
  failureReason,
}: Partial<
  Pick<IrrigationTaskTableRowData, 'status' | 'irrigationDate' | 'failureReason'>
> = {}): IrrigationTaskTableRowData {
  const createdTaskRowData = {
    id: '1',
    status: status || IrrigationStatus.CREATED,
    irrigationDate: irrigationDate || new Date(), // scheduled to happen at start of day
    recipeDay: 1,
    rackPath: 'sites/LAX1/areas/Propagation/lines/PropagationRack1/machines/PropLevel8/containerLocations/Bay1',
    plannedVolume: 187,
    trigger: TaskType.MANUAL,
    lotName: 'xyz',
    tableSerial: '123',
    failureReason,
  };

  return createdTaskRowData;
}
