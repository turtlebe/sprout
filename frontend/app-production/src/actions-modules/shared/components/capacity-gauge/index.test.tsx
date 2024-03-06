import { useFetchContainerCountByPath } from '@plentyag/app-production/src/actions-modules/hooks/use-fetch-container-count-by-path';
import { useGetFarmDefObjectByPath } from '@plentyag/app-production/src/common/hooks/use-get-farm-def-object-by-path';
import { render } from '@testing-library/react';
import React from 'react';

import { CapacityGauge, dataTestIdsCapacityGauge as dataTestIds } from '.';

jest.mock('@plentyag/app-production/src/common/hooks/use-get-farm-def-object-by-path');
const mockUseGetFarmDefObjectByPath = useGetFarmDefObjectByPath as jest.Mock;

jest.mock('@plentyag/app-production/src/actions-modules/hooks/use-fetch-container-count-by-path');
const mockUseFetchContainerCountByPath = useFetchContainerCountByPath as jest.Mock;

describe('Component', () => {
  const mockFarmDefObjectPath = 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestLane1';
  const mockBufferName = 'pre-harvest-lane-1';
  const mockContainerType = 'TOWER';

  beforeEach(() => {
    mockUseGetFarmDefObjectByPath.mockReturnValue({
      data: {
        properties: {
          indexablePositionCount: 62,
        },
      },
      isValidating: false,
    });

    mockUseFetchContainerCountByPath.mockReturnValue({
      data: 40,
      isLoading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = render(
      <CapacityGauge
        farmDefObjectPath={mockFarmDefObjectPath}
        containerType={mockContainerType}
        propertyKey="indexablePositionCount"
      />
    );

    // ASSERT
    // -- correct call
    expect(mockUseGetFarmDefObjectByPath).toHaveBeenCalledWith(mockFarmDefObjectPath, 1);
    expect(mockUseFetchContainerCountByPath).toHaveBeenCalledWith(mockBufferName, [mockContainerType]);

    // -- correct render
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.countAndCapacity)).toHaveTextContent('40/62');
  });

  it('renders with color indicator', () => {
    // ACT
    const { queryByTestId } = render(
      <CapacityGauge
        farmDefObjectPath={mockFarmDefObjectPath}
        containerType={mockContainerType}
        propertyKey="indexablePositionCount"
        colorEnabled
      />
    );

    // ASSERT
    // -- correct call
    expect(mockUseGetFarmDefObjectByPath).toHaveBeenCalledWith(mockFarmDefObjectPath, 1);
    expect(mockUseFetchContainerCountByPath).toHaveBeenCalledWith(mockBufferName, [mockContainerType]);

    // -- correct render
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.countAndCapacity)).toHaveTextContent('40/62');
  });

  it('renders nothing if routingMode is unknown', () => {
    // ACT
    const { queryByTestId } = render(
      <CapacityGauge farmDefObjectPath={null} containerType="TOWER" propertyKey={null} />
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
  });
});
