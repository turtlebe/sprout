import { duplicateGroupAtEachLevel } from './duplicate-group-at-each-level';
import { observationGroups2 } from './test-mocks';

describe('duplicateGroupAtEachLevel', () => {
  it('duplicates each group for each path level', () => {
    expect(duplicateGroupAtEachLevel(observationGroups2)).toEqual([
      {
        path: 'sites/SSF2',
        measurementType: 'TEMPERATURE',
        observationName: 'AirTemperature',
        count: 1,
        lastObservedAt: '2022-01-01T00:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination',
        measurementType: 'TEMPERATURE',
        observationName: 'AirTemperature',
        count: 1,
        lastObservedAt: '2022-01-01T00:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination',
        measurementType: 'TEMPERATURE',
        observationName: 'AirTemperature',
        count: 1,
        lastObservedAt: '2022-01-01T00:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1',
        measurementType: 'TEMPERATURE',
        observationName: 'AirTemperature',
        count: 1,
        lastObservedAt: '2022-01-01T00:00:00Z',
      },
      {
        path: 'sites/SSF2',
        measurementType: 'FLOW_RATE',
        observationName: 'SupplyPumpOutletFlowRate',
        count: 3,
        lastObservedAt: '2022-01-01T02:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination',
        measurementType: 'FLOW_RATE',
        observationName: 'SupplyPumpOutletFlowRate',
        count: 3,
        lastObservedAt: '2022-01-01T02:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination',
        measurementType: 'FLOW_RATE',
        observationName: 'SupplyPumpOutletFlowRate',
        count: 3,
        lastObservedAt: '2022-01-01T02:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1',
        measurementType: 'FLOW_RATE',
        observationName: 'SupplyPumpOutletFlowRate',
        count: 3,
        lastObservedAt: '2022-01-01T02:00:00Z',
      },
      {
        path: 'sites/SSF2',
        measurementType: 'CONCENTRATION',
        observationName: 'SupplyAirCO2',
        count: 4,
        lastObservedAt: '2022-01-01T03:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination',
        measurementType: 'CONCENTRATION',
        observationName: 'SupplyAirCO2',
        count: 4,
        lastObservedAt: '2022-01-01T03:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination',
        measurementType: 'CONCENTRATION',
        observationName: 'SupplyAirCO2',
        count: 4,
        lastObservedAt: '2022-01-01T03:00:00Z',
      },
      {
        path: 'sites/SSF2/areas/Germination/lines/TableGermination/machines/GermChamber1',
        measurementType: 'CONCENTRATION',
        observationName: 'SupplyAirCO2',
        count: 4,
        lastObservedAt: '2022-01-01T03:00:00Z',
      },
    ]);
  });
});
