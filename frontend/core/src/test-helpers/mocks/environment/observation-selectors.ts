import { ObservationSelector } from '@plentyag/core/src/farm-def/types';

export const mockObservationSelectors: ObservationSelector[] = [
  {
    path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/Dehumidifier1',
    measurementType: 'TEMPERATURE',
    observationName: 'AirTemperature',
  },
  {
    path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/Dehumidifier2',
    measurementType: 'TEMPERATURE',
    observationName: 'WaterTemperature',
  },
];
