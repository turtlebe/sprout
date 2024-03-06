import { getInitialDataModelFromActionModel } from '@plentyag/app-production/src/actions-modules/shared/utils';
import { mockPreHarvestInspectionRoutingModeActionModel } from '@plentyag/app-production/src/actions-modules/test-helpers';
import { ActionModuleProps } from '@plentyag/app-production/src/actions-modules/types';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsSetPreHarvestInspectionRoutingMode as dataTestIds, SetPreHarvestInspectionRoutingMode } from '.';

describe('SetPreHarvestInspectionRoutingMode', () => {
  function renderComponent(props?: Partial<ActionModuleProps>) {
    const mockFormik = {
      values: getInitialDataModelFromActionModel(mockPreHarvestInspectionRoutingModeActionModel),
      setFieldValue: jest.fn(),
    } as any;

    return render(
      <SetPreHarvestInspectionRoutingMode
        formik={mockFormik}
        actionModel={mockPreHarvestInspectionRoutingModeActionModel}
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
    expect(queryByTestId(dataTestIds.loading)).not.toBeInTheDocument();
  });
});
