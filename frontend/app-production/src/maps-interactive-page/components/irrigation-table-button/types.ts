import {
  InternalIrrigationStatus,
  IrrigationStatus,
  TaskType,
} from '@plentyag/app-production/src/maps-interactive-page/types';

// data to be dipslayed for a table row.
export interface IrrigationTaskTableRowData {
  id: string;
  status: IrrigationStatus | InternalIrrigationStatus;
  irrigationDate: Date;
  recipeDay: number; // number of days since the table was loaded (ex: 0 if same day as table was loaded)
  rackPath: string;
  plannedVolume?: number;
  trigger?: TaskType;
  lotName: string;
  tableSerial: string;
  failureReason?: string;
}
