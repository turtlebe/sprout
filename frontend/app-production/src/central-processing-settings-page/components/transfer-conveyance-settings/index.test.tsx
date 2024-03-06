import {
  OverrideRoutingTable,
  useFetchReactorState,
  useMultipleActionModulesUtils,
} from '@plentyag/app-production/src/actions-modules';
import { useRegisterActionModule } from '@plentyag/app-production/src/actions-modules/hooks';
import { dataTestIdsSwitch } from '@plentyag/app-production/src/actions-modules/shared/components/switch';
import {
  mockFeatureFlagsActionModel,
  mockOverrideRoutingTableActionModel,
  mockTransferConveyanceReactorState,
} from '@plentyag/app-production/src/actions-modules/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { usePostRequest } from '@plentyag/core/src/hooks/use-axios';
import { useSwrAxios } from '@plentyag/core/src/hooks/use-swr-axios';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import {
  dataTestIdsTransferConveyanceSettings as dataTestIds,
  PICKUP_ROBOT_ROUTING_ENABLED_FIELD,
  ROUTING_PATH_OVERRIDE_ENABLED_FIELD,
  TransferConveyanceSettings,
} from '.';

const { dataTestIdsOverrideRoutingTable } = OverrideRoutingTable;

jest.mock('@plentyag/app-production/src/actions-modules/hooks/use-fetch-reactor-state');
const mockUseFetchReactorState = useFetchReactorState as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-swr-axios');
const mockUseSwrAxios = useSwrAxios as jest.Mock;

jest.mock('@plentyag/core/src/hooks/use-axios');
const mockUsePostRequest = usePostRequest as jest.Mock;

jest.mock('@plentyag/app-production/src/actions-modules/hooks/use-register-action-module');
const mockUseRegisterActionModule = useRegisterActionModule as jest.Mock;
mockUseRegisterActionModule.mockReturnValue({
  registeredActionModules: [],
  registerActionModule: jest.fn(),
  saveActionModules: jest.fn(),
});

jest.mock('@plentyag/app-production/src/actions-modules/hooks/use-multiple-action-modules-utils');
const mockUseMultipleActionModulesUtils = useMultipleActionModulesUtils as jest.Mock;

function getUseMultipleActionModulesUtilsActualImplementation() {
  // for a few test here need to use the actual implementation of useMultipleActionModulesUtils rather than a mock.
  const actualImplementation = jest.requireActual(
    '@plentyag/app-production/src/actions-modules/hooks/use-multiple-action-modules-utils'
  ).useMultipleActionModulesUtils;
  mockUseMultipleActionModulesUtils.mockImplementation(actualImplementation);
}

describe('TransferConveyanceSettings', () => {
  let mockRevalidate = jest.fn();

  function renderTransferConveyanceSettings() {
    return render(<TransferConveyanceSettings />);
  }

  beforeEach(() => {
    mockCurrentUser();

    mockUseMultipleActionModulesUtils.mockReturnValue({ errorList: [], isDirty: false, submitAttemped: false });

    mockUseFetchReactorState.mockReturnValue({
      reactorState: mockTransferConveyanceReactorState,
      revalidate: mockRevalidate,
      isLoading: false,
    });

    mockUseSwrAxios.mockImplementation(({ url }) => {
      const path = 'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance';
      let data;
      switch (url) {
        case `/api/production/actions/${path}/interfaces/Requests/methods/OverrideRoutingTable`:
          data = mockOverrideRoutingTableActionModel;
          break;
        case `/api/production/actions/${path}/interfaces/Requests/methods/SetTransferConveyanceDefaultBehaviorFeatureFlags`:
          data = mockFeatureFlagsActionModel;
          break;
      }
      return {
        data,
        isValidating: false,
        error: null,
      };
    });

    mockUsePostRequest.mockReturnValue({
      makeRequest: jest.fn().mockImplementation(({ onSuccess }) => onSuccess(true)),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderTransferConveyanceSettings();

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.saveButton)).toBeDisabled();
    expect(queryByTestId(dataTestIdsSwitch.field(ROUTING_PATH_OVERRIDE_ENABLED_FIELD))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsSwitch.field(PICKUP_ROBOT_ROUTING_ENABLED_FIELD))).toBeInTheDocument();
    expect(queryByTestId(dataTestIdsOverrideRoutingTable.root)).toBeInTheDocument();
  });

  it('should revalidate current state if revert is clicked', async () => {
    // ARRANGE
    const { queryByTestId } = renderTransferConveyanceSettings();

    // ACT
    await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.revertButton)));

    // ASSERT
    expect(mockRevalidate).toHaveBeenCalled();
  });

  it('should enable save button once there is a change', async () => {
    getUseMultipleActionModulesUtilsActualImplementation();

    // ARRANGE
    const { queryByTestId } = renderTransferConveyanceSettings();

    // ACT
    await actAndAwait(() =>
      fireEvent.click(
        queryByTestId(dataTestIdsSwitch.field(ROUTING_PATH_OVERRIDE_ENABLED_FIELD)).querySelector('input')
      )
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.saveButton)).not.toBeDisabled();
  });

  it('should be able to save after a change has been made', async () => {
    getUseMultipleActionModulesUtilsActualImplementation();

    // ARRANGE
    const mockMakeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess(true));
    mockUsePostRequest.mockReturnValue({
      makeRequest: mockMakeRequest,
    });

    const mockRegisteredActionModule = {
      name: 'testActionModule',
      actionModuleProps: {
        formik: { error: null, submitCount: 0 },
      },
      handleSubmit: jest.fn(),
    };
    const mockSaveActionModules = jest.fn().mockResolvedValue([]);
    mockUseRegisterActionModule.mockReturnValue({
      registeredActionModules: [mockRegisteredActionModule],
      registerActionModule: jest.fn(),
      saveActionModules: mockSaveActionModules,
    });

    const { queryByTestId } = renderTransferConveyanceSettings();

    await actAndAwait(() =>
      fireEvent.click(
        queryByTestId(dataTestIdsSwitch.field(ROUTING_PATH_OVERRIDE_ENABLED_FIELD)).querySelector('input')
      )
    );

    // ACT
    await actAndAwait(() => fireEvent.click(queryByTestId(dataTestIds.saveButton)));

    // ASSERT
    expect(mockMakeRequest).toHaveBeenCalledTimes(1);
    expect(mockRevalidate).toHaveBeenCalled();
    expect(mockSaveActionModules).toHaveBeenCalledWith();
  });

  it('should call useMultipleActionModulesUtils with registered action modules', () => {
    // ARRANGE
    const mockRegisteredActionModule = {
      name: 'testActionModule',
      actionModuleProps: {
        formik: { error: null, submitCount: 0 },
      },
      handleSubmit: jest.fn(),
    };
    mockUseRegisterActionModule.mockReturnValue({
      registeredActionModules: [mockRegisteredActionModule],
      registerActionModule: jest.fn(),
      saveActionMdoules: jest.fn(),
    });

    // ACT
    renderTransferConveyanceSettings();

    // ASSERT
    expect(mockUseMultipleActionModulesUtils).toHaveBeenCalledWith(
      expect.arrayContaining([mockRegisteredActionModule.actionModuleProps])
    );
  });
});
