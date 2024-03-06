import { getInitialDataModelFromActionModel } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { mockExecutionModeActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsSwitch } from '../../shared/components/switch';

import {
  dataTestIdsSetTransferConveyanceDefaultBehaviorExecutionMode as dataTestIds,
  SetTransferConveyanceDefaultBehaviorExecutionMode,
} from '.';

describe('SetTransferConveyanceDefaultBehaviorExecutionMode', () => {
  function renderComponent(props?: Partial<ActionModuleProps>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockExecutionModeActionModel),
      setFieldValue: jest.fn(),
    } as any;

    return render(
      <SetTransferConveyanceDefaultBehaviorExecutionMode
        formik={mockFormik}
        actionModel={mockExecutionModeActionModel}
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
    expect(queryByTestId(dataTestIdsSwitch.field('default_behavior_execution_mode'))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
  });
});
