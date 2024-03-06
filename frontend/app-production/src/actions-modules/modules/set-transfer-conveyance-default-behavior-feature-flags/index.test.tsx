import { getInitialDataModelFromActionModel } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { mockFeatureFlagsActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsSwitch } from '../../shared/components/switch';

import {
  dataTestIdsSetTransferConveyanceDefaultBehaviorExecutionMode as dataTestIds,
  SetTransferConveyanceDefaultBehaviorFeatureFlags,
} from '.';

describe('SetTransferConveyanceDefaultBehaviorFeatureFlags', () => {
  function renderComponent(props?: Partial<ActionModuleProps>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockFeatureFlagsActionModel),
      setFieldValue: jest.fn(),
    } as any;

    return render(
      <SetTransferConveyanceDefaultBehaviorFeatureFlags
        formik={mockFormik}
        actionModel={mockFeatureFlagsActionModel}
        isLoading={false}
        {...props}
      />
    );
  }

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
    expect(queryByTestId(dataTestIdsSwitch.field('lingering_carriers_management_enabled'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSwitch.field('buffer_management_enabled'))).toBeInTheDocument();
    expect(
      queryByTestId(dataTestIdsSwitch.field('empty_carriers_at_pre_harvest_lanes_management_enabled'))
    ).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSwitch.field('pickup_robot_routing_enabled'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSwitch.field('routing_path_override_enabled'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSwitch.field('pre_harvest_buffer_flow_routing_enabled'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
  });
});
