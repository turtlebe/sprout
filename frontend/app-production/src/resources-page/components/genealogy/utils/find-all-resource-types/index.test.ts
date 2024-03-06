import { mockGenealogyData } from '../../hooks/use-genealogy/mock-genealogy-data';

import { findAllResourceTypes } from '.';

describe('findAllResourceTypes', () => {
  it('returns types found in given operations', () => {
    const operations = mockGenealogyData.operations;
    const resourceTypes = findAllResourceTypes(operations);

    expect(resourceTypes).toEqual(['LOADED_TRAY', 'TRAY']);
  });

  it('removes dupes and undefined/null items', () => {
    const operations: ProdResources.Operation[] = [
      {
        id: '123',
        type: 'Add Label',
        username: 'test',
        startDt: '',
        endDt: '',
        machine: null,
        stateIn: null,
        stateOut: {
          id: 'xyz',
          isLatest: false,
          childResourceStateIds: [],
          location: null,
          updatedAt: '',
        },
        materialsCreated: [],
        materialsConsumed: [],
      },
      {
        id: '1234',
        type: 'Add Label',
        username: 'test',
        startDt: '',
        endDt: '',
        machine: null,
        stateIn: null,
        stateOut: {
          id: 'xyz',
          isLatest: false,
          childResourceStateIds: [],
          location: null,
          updatedAt: '',
          containerObj: {
            createdAt: '',
            containerType: 'TRAY',
            id: 'xyz',
            serial: 'serial-xyz',
            properties: null,
          },
        },
        materialsCreated: [],
        materialsConsumed: [],
      },
      {
        id: '1235',
        type: 'Add Label',
        username: 'test',
        startDt: '',
        endDt: '',
        machine: null,
        stateIn: null,
        stateOut: {
          id: 'xyz',
          isLatest: false,
          childResourceStateIds: [],
          location: null,
          updatedAt: '',
          containerObj: {
            createdAt: '',
            containerType: 'TRAY',
            id: 'xyz',
            serial: 'serial-xyz',
            properties: null,
          },
        },
        materialsCreated: [],
        materialsConsumed: [],
      },
    ];

    const resourceTypes = findAllResourceTypes(operations);

    expect(resourceTypes).toEqual(['TRAY']);
  });
});
