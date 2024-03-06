import { Metric } from '@plentyag/core/src/types/environment';

export const metrics = [
  { id: 1, path: 'sites/SSF2', observationName: 'AirTemperature' } as unknown as Metric,
  { id: 2, path: 'sites/SSF2', observationName: 'WaterTemperature' } as unknown as Metric,
  { id: 3, path: 'sites/LAX1', observationName: 'AirTemperature' } as unknown as Metric,
];
