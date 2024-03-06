import { DumpRefillStatus, EventTypes, HealthStatus } from '@plentyag/app-lab-testing/src/common/types/interface-types';

import { deleteFlow } from './delete-flow';

const eventWithResult: LT.Event = {
  type: EventTypes.blob,
  createdAt: new Date(),
  username: 'mary',
  additionalProperties: {
    labTestBlobId: 'blob1234',
  },
};

const eventWithNoResult: LT.Event = {
  type: EventTypes.created,
  createdAt: new Date(),
  username: 'bob',
  additionalProperties: {},
};

const mockInfo: LT.SampleResultInfo = {
  farmDefId: '',
  farmDefPath: '',
  lotCodes: [],
  notes: '',
  predictedHarvestDates: [],
  productCodes: [],
  sampleDate: '',
  sampleTime: '',
  sampleType: '',
  subLocation: '',
  labelDetails: '',
  trialIds: [],
  treatmentIds: [],
  materialLot: '',
  containerId: '',
  healthStatus: HealthStatus.Empty,
  nutrientStage: '',
  dumpRefillStatus: DumpRefillStatus.Empty,
  providerSampleId: '',
};
const mockTestSample1 = {
  labTestKind: 'test1_kind',
  labTestPassed: true,
  labTestProvider: 'test1_provider',
  labTestResults: new Map(), // not needed for test
  info: mockInfo, // not needed for test
  labTestSampleId: '1234',
};

const mockTestSample2 = {
  labTestKind: 'test2_kind',
  labTestPassed: true,
  labTestProvider: 'test2_provider',
  labTestResults: new Map(), // not needed for test
  info: mockInfo, // not needed for test
  labTestSampleId: '1234',
};

describe('deleteFlow()', () => {
  it('does not allow delete if some tests have results', () => {
    const itemsToDelete: LT.SampleResult[] = [
      {
        labTestEvents: [eventWithResult, eventWithNoResult],
        ...mockTestSample1,
      },
      {
        labTestEvents: [eventWithNoResult],
        ...mockTestSample2,
      },
    ];

    const setDeleteStatus = jest.fn();
    deleteFlow(itemsToDelete, setDeleteStatus, () => {});

    expect(setDeleteStatus).toHaveBeenCalledWith({
      open: true,
      statusTitle: 'Error: Cannot delete',
      status: expect.anything(),
      onCancel: expect.anything(),
      onAction: expect.anything(),
      actionTitle: expect.anything(),
    });
  });

  it('allows delete with confirmation when no tests have results', () => {
    const itemsToDelete: LT.SampleResult[] = [
      {
        labTestEvents: [eventWithNoResult],
        ...mockTestSample1,
      },
      {
        labTestEvents: [eventWithNoResult],
        ...mockTestSample2,
      },
    ];

    const setDeleteStatus = jest.fn();
    deleteFlow(itemsToDelete, setDeleteStatus, () => {});

    expect(setDeleteStatus).toHaveBeenCalledWith({
      open: true,
      statusTitle: 'Warning: Confirm delete',
      status: expect.anything(),
      onCancel: expect.anything(),
      onAction: expect.anything(),
      actionTitle: expect.anything(),
    });
  });
});
