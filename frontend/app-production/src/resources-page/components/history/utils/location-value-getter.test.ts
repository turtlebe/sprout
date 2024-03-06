import { ValueGetterParams } from '@ag-grid-community/all-modules';
import { cloneDeep } from 'lodash';

import { locationValueGetter } from '.';

const location: ProdResources.Location = {
  machine: {
    areaName: 'VerticalGrow',
    farmdefMachineId: '525d282e-253d-4b68-84b6-188d132fb366',
    lineName: 'GrowRoom',
    machineName: 'GrowLane3',
    siteName: 'SSF2',
    traceabilityMachineId: '9db358ed-c404-404d-907b-8ec1fa26edae',
  },
};

const mockOperation: ProdActions.OperationDeltaModel = {
  id: 'xyz',
  type: 'Index',
  startDt: '123',
  endDt: '123',
  statesIn: [],
  statesOut: [
    {
      id: '123',
      isLatest: true,
      childResourceStateIds: [],
      location,
      updatedAt: '',
    },
  ],
};

describe('locationValueGetter', () => {
  it('returns undefined when no machine data provided', () => {
    const data = {
      statesOut: [
        {
          location: {},
        },
      ],
    };
    // @ts-ignore: only need data field for tests here
    const params: ValueGetterParams = {
      data,
    };
    expect(locationValueGetter(params)).toBeUndefined();
  });

  it('returns only shortened farm def path when no index is present', () => {
    // @ts-ignore: only need data field for tests here
    const params: ValueGetterParams = {
      data: mockOperation,
    };
    expect(locationValueGetter(params)).toBe('SSF2/VerticalGrow/GrowRoom/GrowLane3');
  });

  it('returns shortened farm def path and index', () => {
    const mockOperationWithContainerLocation = cloneDeep(mockOperation);
    mockOperationWithContainerLocation.statesOut[0].location.containerLocation = {
      farmdefContainerLocationRef: '525d282e-253d-4b68-84b6-188d132fb366:containerLocation-T169',
      index: 169,
      traceabilityContainerLocationId: '1721dcf9-292b-4a44-a78e-8fc27a1c6b67',
      traceabilityMachineId: '9db358ed-c404-404d-907b-8ec1fa26edae',
    };
    // @ts-ignore: only need data field for tests here
    const params: ValueGetterParams = {
      data: mockOperationWithContainerLocation,
    };
    expect(locationValueGetter(params)).toBe('SSF2/VerticalGrow/GrowRoom/GrowLane3 index: 169');
  });

  it('returns shortened container path from "farmDefPath"', () => {
    const mockOperationWithContainerLocation = cloneDeep(mockOperation);
    mockOperationWithContainerLocation.statesOut[0].location.containerLocation = {
      index: 10,
      farmDefPath: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane3/containerLocations/T10',
      farmdefContainerLocationRef: '',
      traceabilityMachineId: '',
      traceabilityContainerLocationId: '',
    };
    // @ts-ignore: only need data field for tests here
    const params: ValueGetterParams = {
      data: mockOperationWithContainerLocation,
    };
    expect(locationValueGetter(params)).toBe('SSF2/VerticalGrow/GrowRoom/GrowLane3/T10 index: 10');
  });
});
