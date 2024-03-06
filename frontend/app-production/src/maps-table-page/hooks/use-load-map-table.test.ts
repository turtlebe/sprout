import { useGetRequest } from '@plentyag/core/src/hooks/use-axios';
import { act, renderHook } from '@testing-library/react-hooks';

import { MapTable } from '../types';

import { useLoadMapTable } from './use-load-map-table';

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
    resource: {
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
  },
];

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUseGetRequest = useGetRequest as jest.Mock;
const mockMakeRequest = ({ onSuccess }) => {
  onSuccess(mockMapTable);
};
mockUseGetRequest.mockReturnValue({
  isLoading: false,
  makeRequest: mockMakeRequest,
});

describe('useLoadMapTable', () => {
  it('gets initial mapTable data when initial farm def path provided', () => {
    const { result } = renderHook(() => useLoadMapTable('sites/SSF2/areas/VerticalGrow'));
    expect(result.current.mapTable).toEqual(mockMapTable);
  });

  it('loads inital data only once - when non-falsely path is provided', () => {
    // first render loads nothing because no path provided
    const { result, rerender } = renderHook(({ initialFarmDefPath }) => useLoadMapTable(initialFarmDefPath), {
      initialProps: { initialFarmDefPath: '' },
    });
    expect(result.current.mapTable).toEqual([]);

    // re-render with path - now renders data.
    rerender({ initialFarmDefPath: 'sites/SSF2/areas/VerticalGrow' });
    expect(result.current.mapTable).toEqual(mockMapTable);

    // subsequent ignored - keeps same data as before.
    rerender({ initialFarmDefPath: '' });
    expect(result.current.mapTable).toEqual(mockMapTable);
  });

  it('has empty mapTable when initial farm def path not provided', () => {
    const { result } = renderHook(() => useLoadMapTable());
    expect(result.current.mapTable).toEqual([]);
  });

  it('has empty mapTable when only site provided without area', () => {
    const { result } = renderHook(() => useLoadMapTable('sites/SSF2/areas/VerticalGrow'));
    act(() => result.current.loadData('sites/SSF2'));
    expect(result.current.mapTable).toEqual([]);
  });

  it('has mapTable when site and area provided', () => {
    const { result } = renderHook(() => useLoadMapTable());
    act(() => result.current.loadData('sites/SSF2/areas/VerticalGrow'));
    expect(result.current.mapTable).toEqual(mockMapTable);
  });

  it('ref will be added if not provided by backend', () => {
    const mockmapTableWithNoRef: MapTable = [
      {
        path: 'sites/SSF2/areas/VerticalGrow/lines/GrowRoom/machines/GrowLane3/containerLocations/T1',
        ref: '',
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
    ];
    const mockMakeRequest = ({ onSuccess }) => {
      onSuccess(mockmapTableWithNoRef);
    };
    mockUseGetRequest.mockReturnValue({
      isLoading: false,
      makeRequest: mockMakeRequest,
    });

    const { result } = renderHook(() => useLoadMapTable('sites/SSF2/areas/VerticalGrow'));
    // should generate uuid regex match
    expect(result.current.mapTable[0].ref).toMatch(
      /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/
    );
  });

  it('clears the mapTable', () => {
    const { result } = renderHook(() => useLoadMapTable('sites/SSF2/areas/VerticalGrow'));
    act(() => result.current.clearData());
    expect(result.current.mapTable).toEqual([]);
  });
});
