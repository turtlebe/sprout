import { isEqual } from 'lodash';

import { mockLabTestTypes } from '../../common/test-helpers/mock-lab-test-types';
import { DumpRefillStatus, HealthStatus } from '../../common/types/interface-types';
import { convertStringToDate, convertTimeToDate } from '../../common/utils/date-utils';

import { getId } from './get-id';
import { getInitialValues } from './get-initial-values';

jest.mock('./get-id');
const mockId = '051ecab0-21c7-46d2-b359-d092dcc73bd4';
(getId as jest.Mock).mockReturnValue(mockId);

const sampleResult1: LT.SampleResult = {
  labTestEvents: [],
  labTestKind: 'Human Pathogen',
  labTestPassed: true,
  labTestProvider: 'IEH',
  labTestResults: new Map(),
  info: {
    sampleDate: '2020-06-01',
    sampleTime: '11:00 AM',
    sampleType: 'Seed',
    labelDetails: 'some-lab-details',
    farmDefPath: '/sites/LAR1',
    farmDefId: '1b513368-80fc-492e-abbb-2ef6bdd14ffa',
    lotCodes: ['lotCode1'],
    notes: 'my note',
    predictedHarvestDates: [
      '2022-04-20',
      '2022-04-21',
      '2022-04-22',
      '2022-04-23',
      '2022-04-24',
      '2022-04-25',
      '2022-04-26',
      '2022-04-27',
      '2022-04-28',
    ],
    productCodes: ['BAC'],
    subLocation: 'sub-loc1',
    trialIds: ['123', '456'],
    treatmentIds: ['abc', 'xyz'],
    healthStatus: HealthStatus.Healthy,
    materialLot: '',
    containerId: '',
    nutrientStage: '',
    dumpRefillStatus: DumpRefillStatus.Empty,
    providerSampleId: '',
  },
  labTestSampleId: '123',
};

const selectedRows: LT.SampleResult[] = [sampleResult1];

const username = 'userx';

describe('getInitialValues()', () => {
  it('carries over fields from results view when creating lab test(s) from existing ones', () => {
    // fields carried over from results view:
    // - labTestKind
    // - labTestProvider
    // - sampleType
    // - location
    // - sublocation
    // - labelDetails
    // - productCodes
    // - lotCodes
    // - tests
    const { initialValues } = getInitialValues({
      username,
      labTestTypes: mockLabTestTypes,
      initialSelectedRows: selectedRows,
      isEdit: false,
    });
    expect(initialValues).toHaveLength(1);
    const value = initialValues[0];
    const expectedValueWithCarryOver = {
      id: mockId,
      username: username,
      labTestKind: sampleResult1.labTestKind,
      labTestProvider: sampleResult1.labTestProvider,
      sampleType: sampleResult1.info.sampleType,
      location: { path: sampleResult1.info.farmDefPath, id: sampleResult1.info.farmDefId },
      subLocation: sampleResult1.info.subLocation,
      labelDetails: sampleResult1.info.labelDetails,
      harvestDates: undefined,
      productCodes: [{ name: sampleResult1.info.productCodes[0], displayName: '' }],
      notes: '',
      lotCodes: sampleResult1.info.lotCodes,
      trialIds: '',
      treatmentIds: '',
      harvestCycle: '',
      healthStatus: HealthStatus.Empty,
      nutrientStage: '',
      dumpRefillStatus: DumpRefillStatus.Empty,
      providerSampleId: '',
      materialLot: '',
      containerId: '',
      tests: [
        { name: 'APC', selected: true },
        { name: 'ECC', selected: true },
      ],
    };
    delete value.sampleDate;
    delete value.sampleTime;
    expect(value).toEqual(expectedValueWithCarryOver);
  });

  it('shows all fields when an editing existing lab tests', () => {
    const { initialValues } = getInitialValues({
      username,
      labTestTypes: mockLabTestTypes,
      initialSelectedRows: selectedRows,
      isEdit: true,
    });
    expect(initialValues).toHaveLength(1);
    const value = initialValues[0];
    const expectedEditValue: LT.CreateItem = {
      username,
      id: sampleResult1.labTestSampleId,
      sampleDate: convertStringToDate(sampleResult1.info.sampleDate),
      sampleTime: convertTimeToDate(sampleResult1.info.sampleTime),
      labTestKind: sampleResult1.labTestKind,
      labTestProvider: sampleResult1.labTestProvider,
      sampleType: sampleResult1.info.sampleType,
      location: {
        path: sampleResult1.info.farmDefPath,
        id: sampleResult1.info.farmDefId,
      },
      subLocation: sampleResult1.info.subLocation,
      labelDetails: sampleResult1.info.labelDetails,
      harvestDates: {
        begin: convertStringToDate(sampleResult1.info.predictedHarvestDates[0]),
        end: convertStringToDate(sampleResult1.info.predictedHarvestDates[8]),
      },
      productCodes: [{ name: sampleResult1.info.productCodes[0], displayName: '' }],
      notes: sampleResult1.info.notes,
      lotCodes: sampleResult1.info.lotCodes,
      trialIds: '123,456',
      treatmentIds: 'abc,xyz',
      harvestCycle: '',
      healthStatus: HealthStatus.Healthy,
      materialLot: sampleResult1.info.materialLot,
      containerId: sampleResult1.info.containerId,
      tests: [
        { name: 'APC', selected: true },
        { name: 'ECC', selected: true },
      ],
      nutrientStage: sampleResult1.info.nutrientStage,
      dumpRefillStatus: sampleResult1.info.dumpRefillStatus,
      providerSampleId: '',
    };

    expect(isEqual(value, expectedEditValue)).toBeTruthy();
  });

  it('has initialValue with defaults when no rows are selected', () => {
    const { initialValues, initialValue: defaultValue } = getInitialValues({
      username,
      labTestTypes: mockLabTestTypes,
      initialSelectedRows: [],
      isEdit: false,
    });
    expect(initialValues).toHaveLength(1);
    expect(initialValues[0]).toEqual(defaultValue);
  });

  it('has initialValue has defaults when no lab test types are provided', () => {
    const { initialValues, initialValue: defaultValue } = getInitialValues({
      username,
      labTestTypes: [],
      initialSelectedRows: selectedRows,
      isEdit: false,
    });
    expect(initialValues).toHaveLength(1);
    expect(initialValues[0]).toEqual(defaultValue);
  });
});
