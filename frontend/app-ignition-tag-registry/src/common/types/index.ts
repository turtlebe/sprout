export interface DefaultModel {
  uid: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface Tag extends DefaultModel {
  path: string;
  kind: string;
  tagProvider: string;
  tagPath: string;
  measurementType: string;
  measurementName: string;
  measurementUnit: string;
  deviceType: string;
  tagStatus?: string;
}

export const TAG_STATUSES = ['ACTIVE', 'PENDING', 'INACTIVE'];

export const tagsTableCols = {
  measurementName: {
    headerName: 'Observation Name',
    field: 'measurementName',
    colId: 'measurementName',
    headerTooltip: 'e.g. "SupplyWaterTemperature" or "HarvesterCycleCount" or "WasteWaterTankLevel"',
  },
};
