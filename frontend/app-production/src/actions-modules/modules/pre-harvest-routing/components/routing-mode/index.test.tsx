import { CapacityGauge } from '@plentyag/app-production/src/actions-modules/shared/components/capacity-gauge';
import { getInitialDataModelFromActionModel } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { mockPreHarvestInspectionRoutingModeActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsRoutingMode as dataTestIds, RoutingMode } from '.';

jest.mock('@plentyag/app-production/src/actions-modules/shared/components/capacity-gauge');
const MockCapacityGauge = CapacityGauge as jest.Mock;

describe('RoutingMode', () => {
  function renderComponent(props?: Partial<ActionModuleProps>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockPreHarvestInspectionRoutingModeActionModel),
      isValid: true,
      setValues: jest.fn(),
    } as any;

    return render(
      <RoutingMode
        formik={mockFormik}
        actionModel={mockPreHarvestInspectionRoutingModeActionModel}
        isLoading={false}
        {...props}
      />
    );
  }

  beforeEach(() => {
    MockCapacityGauge.mockReturnValue(<div></div>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading if isLoading is passed through', () => {
    // ACT
    const { queryByTestId } = renderComponent({
      isLoading: true,
    });

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).toBeInTheDocument();
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderComponent();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
    expect(MockCapacityGauge).toHaveBeenCalledWith(
      expect.objectContaining({
        farmDefObjectPath: 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestLane1',
        containerType: 'TOWER',
        propertyKey: 'indexablePositionCount',
        colorEnabled: true,
      }),
      expect.anything()
    );
    expect(MockCapacityGauge).toHaveBeenCalledWith(
      expect.objectContaining({
        farmDefObjectPath: 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestLane2',
        containerType: 'TOWER',
        propertyKey: 'indexablePositionCount',
        colorEnabled: true,
      }),
      expect.anything()
    );
  });
});
