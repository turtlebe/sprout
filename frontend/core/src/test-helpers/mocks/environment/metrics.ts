import { Metric } from '@plentyag/core/src/types/environment';
import { uniqueId } from 'lodash';

export const mockMetrics: Metric[] = [
  {
    alertRules: [],
    createdAt: '2021-09-21T14:28:38.740039Z',
    createdBy: 'llee',
    id: '22b4999a-b7ff-4d81-8d4d-5cbab5189427',
    measurementType: 'TEMPERATURE',
    observationName: 'AirTemperature',
    path: 'sites/LAR1',
    updatedAt: '2021-09-21T14:28:38.740039Z',
    updatedBy: 'llee',
    unitConfig: {
      min: 0,
      max: 35,
    },
  },
  {
    alertRules: [],
    createdAt: '2021-09-20T20:16:27.379640Z',
    createdBy: 'llee',
    id: 'ca4260ca-ddf3-409f-acef-3d77dfdde7c7',
    measurementType: 'TEMPERATURE',
    observationName: 'AirTemperature',
    path: 'sites/SSF2',
    updatedAt: '2021-09-20T20:16:27.379640Z',
    updatedBy: 'llee',
    unitConfig: {
      min: 0,
      max: 35,
    },
  },
];

export const buildMetric = ({
  path = 'sites/SSF2/areas/SierraVerticalGrow',
  measurementType = 'TEMPERATURE',
  observationName = 'WaterTemperature',
  alertRules = [],
  unitConfig = {
    min: 0,
    max: 35,
  },
}: Partial<Metric>): Metric => {
  return {
    alertRules,
    createdAt: '2021-09-21T14:28:38.740039Z',
    createdBy: 'llee',
    id: uniqueId(),
    measurementType,
    observationName,
    path,
    updatedAt: '2021-09-21T14:28:38.740039Z',
    updatedBy: 'llee',
    unitConfig,
  };
};
