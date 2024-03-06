import { ObservationGroup } from '@plentyag/core/src/types';

export const observationGroups: ObservationGroup[] = [
  { path: 'p1', measurementType: 'm1', observationName: 'o1', count: 1, lastObservedAt: '2022-01-01T00:00:00Z' },
  { path: 'p1', measurementType: 'm1', observationName: 'o2', count: 2, lastObservedAt: '2022-01-01T01:00:00Z' },
  { path: 'p1', measurementType: 'm2', observationName: 'o3', count: 3, lastObservedAt: '2022-01-01T02:00:00Z' },
  { path: 'p1', measurementType: 'm3', observationName: 'o4', count: 4, lastObservedAt: '2022-01-01T03:00:00Z' },

  { path: 'p2', measurementType: 'm4', observationName: 'o5', count: 1, lastObservedAt: '2022-01-01T04:00:00Z' },
  { path: 'p2', measurementType: 'm4', observationName: 'o6', count: 2, lastObservedAt: '2022-01-01T05:00:00Z' },
  { path: 'p2', measurementType: 'm4', observationName: 'o7', count: 3, lastObservedAt: '2022-01-01T06:00:00Z' },
  { path: 'p2', measurementType: 'm5', observationName: 'o8', count: 4, lastObservedAt: '2022-01-01T07:00:00Z' },
];

export const observationGroups2: ObservationGroup[] = [
  {
    path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1',
    measurementType: 'TEMPERATURE',
    observationName: 'AirTemperature',
    count: 1,
    lastObservedAt: '2022-01-01T00:00:00Z',
  },
  {
    path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1',
    measurementType: 'FLOW_RATE',
    observationName: 'SupplyPumpOutletFlowRate',
    count: 3,
    lastObservedAt: '2022-01-01T02:00:00Z',
  },
  {
    path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1',
    measurementType: 'CONCENTRATION',
    observationName: 'SupplyAirCO2',
    count: 4,
    lastObservedAt: '2022-01-01T03:00:00Z',
  },
];
