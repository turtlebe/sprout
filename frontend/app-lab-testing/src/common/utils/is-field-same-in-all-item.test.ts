import { DumpRefillStatus, HealthStatus } from '../types/interface-types';

import { isFieldSameInAllItems } from './is-field-same-in-all-items';

const dummy: LT.CreateItem = {
  id: '1',
  username: 'test',
  sampleDate: new Date(),
  sampleTime: new Date(),
  labTestKind: 'kind1',
  labTestProvider: '',
  sampleType: '',
  location: { path: '', id: '' },
  subLocation: 'loc',
  labelDetails: 'label',
  harvestDates: undefined,
  productCodes: [],
  lotCodes: [],
  notes: '',
  tests: [],
  treatmentIds: '',
  trialIds: '',
  materialLot: '',
  containerId: '',
  harvestCycle: '',
  healthStatus: HealthStatus.Empty,
  nutrientStage: '',
  dumpRefillStatus: DumpRefillStatus.Empty,
  providerSampleId: '',
};
describe('isFieldSameInAllItems()', () => {
  it('when empty should return true', () => {
    expect(isFieldSameInAllItems<LT.CreateItem>(field => field.labTestKind, [])).toBeTruthy();
  });

  it('when all same should return true', () => {
    expect(
      isFieldSameInAllItems<LT.CreateItem>(
        field => field.labTestProvider,
        [
          { ...dummy, labTestProvider: 'x' },
          { ...dummy, labTestProvider: 'x' },
        ]
      )
    ).toBeTruthy();

    expect(
      isFieldSameInAllItems<LT.CreateItem>(
        field => field.labTestKind,
        [
          { ...dummy, labTestKind: 'y' },
          { ...dummy, labTestKind: 'y' },
        ]
      )
    ).toBeTruthy();
  });

  it('when one empty and other same should return true', () => {
    expect(
      isFieldSameInAllItems<LT.CreateItem>(
        field => field.labTestProvider,
        [
          { ...dummy, labTestProvider: 'x' },
          { ...dummy, labTestProvider: '' },
          { ...dummy, labTestProvider: 'x' },
        ]
      )
    ).toBeTruthy();
  });

  it('when one different should return false', () => {
    expect(
      isFieldSameInAllItems<LT.CreateItem>(
        field => field.labTestProvider,
        [
          { ...dummy, labTestProvider: 'x' },
          { ...dummy, labTestProvider: '' },
          { ...dummy, labTestProvider: 'y' },
        ]
      )
    ).toBeFalsy();
  });

  it('when no lab providers should return true', () => {
    expect(
      isFieldSameInAllItems<LT.CreateItem>(
        field => field.labTestProvider,
        [
          { ...dummy, labTestProvider: '' },
          { ...dummy, labTestProvider: '' },
        ]
      )
    ).toBeTruthy();
  });

  it('when one lab provider true', () => {
    expect(
      isFieldSameInAllItems<LT.CreateItem>(field => field.labTestProvider, [{ ...dummy, labTestProvider: 'x' }])
    ).toBeTruthy();
  });
});
