import { render } from '@testing-library/react';
import React from 'react';

import { useActionModule } from '../../hooks/use-action-module';
import { getInitialDataModelFromActionModel } from '../../shared/utils';
import {
  mockPreHarvestInspectionFeatureFlagsActionModel,
  mockPreHarvestInspectionRoutingModeActionModel,
  mockPreHarvestReactorState,
} from '../../test-helpers';

import { dataTestIdsPreHarvestRouting as dataTestIds, PreHarvestRouting } from '.';

jest.mock('../../hooks/use-action-module');
const mockUseActionModule = useActionModule as jest.Mock;

describe('PreHarvestRouting', () => {
  const mockPreHarvestPath = 'sites/LAX1/areas/VerticalGrow/lines/PreHarvest/machines/PreHarvestInspection';

  beforeEach(() => {
    mockUseActionModule.mockImplementation(({ actionModule }) => {
      const actionModel =
        actionModule.actionName === 'SetPreHarvestInspectionDefaultBehaviorFeatureFlags'
          ? mockPreHarvestInspectionFeatureFlagsActionModel
          : mockPreHarvestInspectionRoutingModeActionModel;
      return {
        actionModuleProps: {
          formik: { values: getInitialDataModelFromActionModel(actionModel, {}) },
          actionModel,
          isLoading: false,
          onChange: jest.fn(),
        },
        handleSubmit: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ARRANGE
    const mockRegisterActionModule = jest.fn();

    // ACT
    const { queryByTestId } = render(
      <PreHarvestRouting
        reactorState={mockPreHarvestReactorState}
        isLoading={false}
        registerActionModule={mockRegisterActionModule}
        reactorPath={mockPreHarvestPath}
      />
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(mockUseActionModule).toHaveBeenCalledTimes(2);
    expect(mockRegisterActionModule).toHaveBeenCalledTimes(2);
  });
});
