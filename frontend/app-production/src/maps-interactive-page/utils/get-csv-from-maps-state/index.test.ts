import { DateTime } from 'luxon';

import { mockFarmDefMachine } from '../../test-helpers/mock-farm-def-object-data';
import { mocksResourcesState } from '../../test-helpers/mock-maps-state';

import { getCSVFromMapsState } from '.';

describe('getCSVFromMapsState', () => {
  it('returns array given machines and maps state', () => {
    const selectedDate = DateTime.fromISO('2021-02-20T00:00:00.000Z');

    const machines = [mockFarmDefMachine];

    const mockMapsState: any = {
      '123-abc:containerLocation-T1': {
        resourceState: {
          ...mocksResourcesState[0],
          materialAttributes: {
            loadedInPropAt: '2021-02-14T00:00:00.000Z',
          },
          location: {
            ...mocksResourcesState[0].location,
            containerLocation: {
              farmdefContainerLocationRef: '123-abc:containerLocation-T1',
            },
          },
        },
      },
    };

    const result = getCSVFromMapsState(machines, mockMapsState, selectedDate);

    expect(result).toEqual([
      [
        'Site',
        'Area',
        'Line',
        'Machine',
        'Container Location',
        'Container Serial',
        'Container Type',
        'Material Lot Name',
        'Crop',
        'Container Labels',
        'Material Labels',
        'Container Status',
        'Load Date',
        'Age Cohort',
        'Is conflict?',
      ],
      [
        'SSF2',
        'Propagation',
        'PropagationRack',
        'GrowLane1',
        'T1',
        'P900-0008046A:M0UO-2B2E-MU',
        'TABLE',
        '06d6b29c-5c00-44ba-bfb7-bdb75c17377c',
        'BAC',
        '',
        '',
        'IN_USE',
        '2021-02-14T00:00:00.000Z',
        6,
        'FALSE',
      ],
    ]);
  });

  it('skips blank resources making sure there are no blank rows', () => {
    const selectedDate = DateTime.fromISO('2021-02-20T00:00:00.000Z');

    const machines = [mockFarmDefMachine];

    const mockMapsState: any = {
      '123-abc:containerLocation-T1': {
        resourceState: {
          ...mocksResourcesState[0],
          materialAttributes: {
            loadedInPropAt: '2021-02-14T00:00:00.000Z',
          },
          location: {
            ...mocksResourcesState[0].location,
            containerLocation: {
              farmdefContainerLocationRef: '123-abc:containerLocation-T1',
            },
          },
        },
      },
      '123-empty': {
        resourceState: undefined,
      },
      '123-abc:containerLocation-T2': {
        resourceState: {
          ...mocksResourcesState[1],
          materialAttributes: {
            loadedInPropAt: '2021-02-14T00:00:00.000Z',
          },
          location: {
            ...mocksResourcesState[1].location,
            containerLocation: {
              farmdefContainerLocationRef: '123-abc:containerLocation-T2',
            },
          },
        },
      },
    };

    const result = getCSVFromMapsState(machines, mockMapsState, selectedDate);

    expect(result).toEqual([
      [
        'Site',
        'Area',
        'Line',
        'Machine',
        'Container Location',
        'Container Serial',
        'Container Type',
        'Material Lot Name',
        'Crop',
        'Container Labels',
        'Material Labels',
        'Container Status',
        'Load Date',
        'Age Cohort',
        'Is conflict?',
      ],
      [
        'SSF2',
        'Propagation',
        'PropagationRack',
        'GrowLane1',
        'T1',
        'P900-0008046A:M0UO-2B2E-MU',
        'TABLE',
        '06d6b29c-5c00-44ba-bfb7-bdb75c17377c',
        'BAC',
        '',
        '',
        'IN_USE',
        '2021-02-14T00:00:00.000Z',
        6,
        'FALSE',
      ],
      [
        'SSF2',
        'Propagation',
        'PropagationRack',
        '',
        '',
        'P900-0008046A:GKXJ-SOP4-PX',
        'TABLE',
        '412d82b3-e492-4163-8e4d-c135e2064f12',
        'BAC',
        '',
        '',
        'IN_USE',
        '2021-02-14T00:00:00.000Z',
        6,
        'FALSE',
      ],
    ]);
  });

  it('shows conflicts as additional rows and mark an asterisk under "Is conflict?" column', () => {
    const selectedDate = DateTime.fromISO('2021-02-20T00:00:00.000Z');

    const machines = [mockFarmDefMachine];

    const mockMapsState: any = {
      '123-abc:containerLocation-T1': {
        resourceState: {
          ...mocksResourcesState[0],
          materialAttributes: {
            loadedInPropAt: '2021-02-14T00:00:00.000Z',
          },
          location: {
            ...mocksResourcesState[0].location,
            containerLocation: {
              farmdefContainerLocationRef: '123-abc:containerLocation-T1',
            },
          },
        },
      },
      '123-abc:containerLocation-T2': {
        resourceState: null,
        conflicts: [
          {
            resourceState: {
              ...mocksResourcesState[1],
              materialAttributes: {
                loadedInPropAt: '2021-02-14T00:00:00.000Z',
              },
              location: {
                ...mocksResourcesState[1].location,
                containerLocation: {
                  farmdefContainerLocationRef: '123-abc:containerLocation-T2',
                },
              },
            },
          },
          {
            resourceState: {
              ...mocksResourcesState[2],
              materialAttributes: {
                loadedInPropAt: '2021-02-14T00:00:00.000Z',
              },
              location: {
                ...mocksResourcesState[1].location,
                containerLocation: {
                  farmdefContainerLocationRef: '123-abc:containerLocation-T2',
                },
              },
            },
          },
        ],
      },
      '123-abc:containerLocation-T3': {
        resourceState: {
          ...mocksResourcesState[3],
          materialAttributes: {
            loadedInPropAt: '2021-02-14T00:00:00.000Z',
          },
          location: {
            ...mocksResourcesState[3].location,
            containerLocation: {
              farmdefContainerLocationRef: '123-abc:containerLocation-T3',
            },
          },
        },
      },
    };

    const result = getCSVFromMapsState(machines, mockMapsState, selectedDate);

    expect(result).toEqual([
      [
        'Site',
        'Area',
        'Line',
        'Machine',
        'Container Location',
        'Container Serial',
        'Container Type',
        'Material Lot Name',
        'Crop',
        'Container Labels',
        'Material Labels',
        'Container Status',
        'Load Date',
        'Age Cohort',
        'Is conflict?',
      ],
      [
        'SSF2',
        'Propagation',
        'PropagationRack',
        'GrowLane1',
        'T1',
        'P900-0008046A:M0UO-2B2E-MU',
        'TABLE',
        '06d6b29c-5c00-44ba-bfb7-bdb75c17377c',
        'BAC',
        '',
        '',
        'IN_USE',
        '2021-02-14T00:00:00.000Z',
        6,
        'FALSE',
      ],
      [
        'SSF2',
        'Propagation',
        'PropagationRack',
        '',
        '',
        'P900-0008046A:GKXJ-SOP4-PX',
        'TABLE',
        '412d82b3-e492-4163-8e4d-c135e2064f12',
        'BAC',
        '',
        '',
        'IN_USE',
        '2021-02-14T00:00:00.000Z',
        6,
        'TRUE',
      ],
      [
        'SSF2',
        'Propagation',
        'PropagationRack',
        '',
        '',
        'P900-0008046A:CWS6-7POV-3H',
        'TABLE',
        'a728cf39-d2c1-4034-9570-aa8128292e9f',
        'BAC,WHC',
        '',
        '',
        'IN_USE',
        '2021-02-14T00:00:00.000Z',
        6,
        'TRUE',
      ],
      [
        'SSF2',
        'Propagation',
        'PropagationRack',
        '',
        '',
        'P900-0008046A:S0ZW-2BEL-NV',
        'TABLE',
        '',
        '',
        '',
        '',
        'CLEAN',
        '',
        '',
        'FALSE',
      ],
    ]);
  });
});
