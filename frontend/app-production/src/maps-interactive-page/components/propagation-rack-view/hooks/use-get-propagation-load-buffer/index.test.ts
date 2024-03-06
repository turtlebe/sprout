import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks';
import { useLoadMapsState, useMapsDateRange } from '@plentyag/app-production/src/maps-interactive-page/hooks';
import { mockFarmDefContainerLocations } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-farm-def-object-data';
import { mocksResourcesState } from '@plentyag/app-production/src/maps-interactive-page/test-helpers/mock-maps-state';
import { MapsState } from '@plentyag/app-production/src/maps-interactive-page/types';
import { renderHook } from '@testing-library/react-hooks';
import { cloneDeep } from 'lodash';
import { DateTime } from 'luxon';

import { useGetPropagationLoadBuffer } from '.';

jest.mock('../../../../hooks/use-load-maps-state');
const mockUseLoadMapsState = useLoadMapsState as jest.Mock;

jest.mock('@plentyag/app-production/src/common/hooks/use-get-farm-def-object-by-path');
const mockUseGetFarmDefObjectByPath = useGetFarmDefObjectByPath as jest.Mock;

jest.mock('../../../../hooks/use-maps-date-range');
const mockUseMapsStateRange = useMapsDateRange as jest.Mock;

const currentDate = DateTime.now();
const startDate = DateTime.now().minus({ days: 15 }).toISO();
const endDate = DateTime.now().toISO();

describe('useGetPropagationLoadBuffer', () => {
  beforeEach(() => {
    mockUseMapsStateRange.mockReturnValue({
      startDate,
      endDate,
    });
  });

  it('does not get for non-LAX1 site', () => {
    mockUseGetFarmDefObjectByPath.mockReturnValue({
      isValidating: false,
      data: undefined,
    });

    mockUseLoadMapsState.mockReturnValue({
      isloading: false,
      mapState: undefined,
    });

    const linePath = 'sites/SSF2/areas/Propagation/lines/PropagationRack';
    const { result } = renderHook(() =>
      useGetPropagationLoadBuffer({ propagationRack: 1, selectedDate: currentDate, linePath })
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockUseGetFarmDefObjectByPath).toHaveBeenLastCalledWith(undefined, 1);
    expect(result.current.loadBufferContainerLocation).toBeFalsy();
    expect(mockUseLoadMapsState).toHaveBeenLastCalledWith(undefined);
    expect(result.current.loadBufferState).toBeFalsy();
  });

  it('gets load buffer for lax1 site/farm', () => {
    const linePath = 'sites/LAX1/areas/Propagation/lines/PropagationRack1';

    const propRack1LoadBuffer = cloneDeep(mockFarmDefContainerLocations);
    propRack1LoadBuffer.name = 'buffer1';
    const propRack2LoadBuffer = cloneDeep(mockFarmDefContainerLocations);
    propRack2LoadBuffer.name = 'buffer2';

    const mockTableConveyance = {
      containerLocations: {
        PropagationRack1LoadBuffer: propRack1LoadBuffer,
        PropagationRack2LoadBuffer: propRack2LoadBuffer,
      },
    };

    (useGetFarmDefObjectByPath as jest.Mock).mockReturnValue({
      isValidating: false,
      data: mockTableConveyance,
    });

    const mockLoadBufferState: MapsState = {
      'e929f6df-851e-46ad-9807-ecaa585eaaf0:containerLocation-PropagationRack1LoadBuffer': {
        resourceState: mocksResourcesState[0],
      },
      'e929f6df-851e-46ad-9807-ecaa585eaaf0:containerLocation-PropagationRack2LoadBuffer': {
        resourceState: mocksResourcesState[1],
      },
    };
    mockUseLoadMapsState.mockReturnValue({
      isloading: false,
      mapsState: mockLoadBufferState,
    });

    const { result, rerender } = renderHook(
      ({ rackNumber }) =>
        useGetPropagationLoadBuffer({ propagationRack: rackNumber, selectedDate: currentDate, linePath }),
      {
        initialProps: { rackNumber: 1 },
      }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadBufferContainerLocation).toEqual(propRack1LoadBuffer);
    expect(result.current.loadBufferState).toEqual(mockLoadBufferState);

    rerender({ rackNumber: 2 });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadBufferContainerLocation).toEqual(propRack2LoadBuffer);
    expect(result.current.loadBufferState).toEqual(mockLoadBufferState);

    mockUseLoadMapsState.mockReturnValue({
      isloading: false,
      mapsState: undefined,
    });

    // mock only has two racks, so this should return undefined for container location
    rerender({ rackNumber: 3 });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadBufferContainerLocation).toEqual(undefined);
  });
});
