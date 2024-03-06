import { renderHook } from '@testing-library/react-hooks';

import { MapTable } from '../../types';

import { useGetMapTableWithConflictsBrokenOut } from '.';

const mockMapTable: MapTable = [
  {
    path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane3/containerLocations/T1',
    ref: '123',
    resource: {
      containerId: 'xyz',
      containerLabels: [],
      containerType: 'TOWER',
      containerSerial: '888',
      crop: 'WHC',
      materialId: 'abc',
      materialLabels: [],
      materialLotName: 'lot-name-xyz',
      containerStatus: 'TRASHED',
    },
  },
  {
    path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane3/containerLocations/T2',
    ref: '345',
    conflicts: [
      {
        containerId: 'xyz1',
        containerLabels: [],
        containerSerial: '999',
        containerType: 'TOWER',
        crop: 'WHC',
        materialId: 'abc1',
        materialLabels: [],
        materialLotName: 'lot-name-xyz1',
        containerStatus: 'IN_USE',
      },
      {
        containerId: 'xyz2',
        containerLabels: [],
        containerSerial: '999',
        containerType: 'TOWER',
        crop: 'WHC',
        materialId: 'abc2',
        materialLabels: [],
        materialLotName: 'lot-name-xyz1',
        containerStatus: 'IN_USE',
      },
    ],
  },
];

describe('useGetMapTableWithConflictsBrokenOut', () => {
  it('returns data with conflicts on their own row', () => {
    const { result } = renderHook(() => useGetMapTableWithConflictsBrokenOut(mockMapTable));

    const mapTable = result.current;
    expect(mapTable).toHaveLength(3);

    expect(mapTable[0]).toEqual(mockMapTable[0]);

    // the conflicts here are broken out in their own indexes.

    expect(mapTable[1].resource).toEqual(mockMapTable[1].conflicts[0]);
    expect(mapTable[1].ref).toEqual(`${mockMapTable[1].ref}-0`);

    expect(mapTable[2].resource).toEqual(mockMapTable[1].conflicts[1]);
    expect(mapTable[2].ref).toEqual(`${mockMapTable[1].ref}-1`);
  });
});
