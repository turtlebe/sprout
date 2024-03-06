import { NormalizedObservation } from '@plentyag/core/src/types';

const MOCK_OBSERVATION: NormalizedObservation = {
  numericValue: false,
  observationId: 'af13dfe75f0f111df732fe4483d5cdbcce87bff5345ebdf757444291f22ef882',
  clientId: '8ccfZyhNXSPqcaKIE5o5bLEShXYMZo',
  path: 'sites/TEST/areas/CPROC/lines/CentralProcessing/machines/AlphaRack/deviceLocations/Hathor1',
  objectId: null,
  deviceId: 'ff347c95-1fcd-4352-8746-b2eaf0ef3564',
  observationName: 'HathorFaultDetected',
  measurementType: 'BINARY_STATE',
  createdAt: '2021-10-05 10:22:46.032',
  isPrediction: null,
  observedAt: null,
  predictionValidAt: null,
  units: null,
  valueDataType: 'boolValue',
  valueString: 'true',
  valueNumeric: null,
  containerLocationRef: null,
  containerId: null,
  materialId: null,
  materialRegionType: null,
  material: null,
  derivedFrom: null,
  eventType: null,
  eventId: null,
  otherProperties: {
    faults:
      '{\n    "overcurrent1": true,\n    "overcurrent2": true,\n    "overcurrent3": true,\n    "overcurrent4": true,\n    "overcurrent5": true,\n    "overcurrent6": true\n  }',
  },
  rawObservation: {
    clientId: '8ccfZyhNXSPqcaKIE5o5bLEShXYMZo',
    createdAt: '2021-10-05T10:22:46.032Z',
    datum: {
      observedDatum: {
        datumValue: {
          boolValue: true,
          measurementType: 'BINARY_STATE',
        },
        properties: {
          otherProperties: {
            faults:
              '{\n    "overcurrent1": true,\n    "overcurrent2": true,\n    "overcurrent3": true,\n    "overcurrent4": true,\n    "overcurrent5": true,\n    "overcurrent6": true\n  }',
          },
        },
      },
    },
    deviceId: 'ff347c95-1fcd-4352-8746-b2eaf0ef3564',
    name: 'HathorFaultDetected',
    path: 'sites/TEST/areas/CPROC/lines/CentralProcessing/machines/AlphaRack/deviceLocations/Hathor1',
  },
  isNumericValue: false,
};

import { getFaultsToClear } from '.';

describe('getFaultsToClear', () => {
  it('parses the observations and returns a dictionnary of the faults to clear', () => {
    expect(getFaultsToClear(MOCK_OBSERVATION)).toEqual({
      faults: {
        overcurrent1: true,
        overcurrent2: true,
        overcurrent3: true,
        overcurrent4: true,
        overcurrent5: true,
        overcurrent6: true,
      },
    });
  });

  it('returns an empty faults object', () => {
    expect(getFaultsToClear(undefined)).toEqual({ faults: {} });
    expect(getFaultsToClear({ ...MOCK_OBSERVATION, otherProperties: {} })).toEqual({ faults: {} });
    expect(getFaultsToClear({ ...MOCK_OBSERVATION, otherProperties: { faults: undefined } })).toEqual({
      faults: {},
    });
  });
});
