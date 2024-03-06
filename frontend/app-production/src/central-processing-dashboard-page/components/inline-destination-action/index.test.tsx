import { dataTestIdsDropDown, useActionModule } from '@plentyag/app-production/src/actions-modules';
import {
  mockMoveCarrierActionModel,
  mockMoveCarrierDataModel,
} from '@plentyag/app-production/src/actions-modules/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { act, render, waitFor } from '@testing-library/react';
import React from 'react';

import { mockBufferCarriers } from '../../test-helpers';

import { dataTestIdsInlineDestinationAction as dataTestIds, InlineDestinationAction } from '.';

jest.mock('@plentyag/app-production/src/actions-modules/hooks/use-action-module');
const mockUseActionModule = useActionModule as jest.Mock;

describe('InlineDestinationAction', () => {
  let mockCarrierState, mockResetForm, mockHandleSubmit, mockGetDataModel, mockUseActionModuleProps;

  beforeEach(() => {
    // ARRANGE
    // -- carrier state
    mockCarrierState = { ...mockBufferCarriers[0] };

    // -- current user olittle
    mockCurrentUser();

    // -- mock use action module functions
    mockResetForm = jest.fn();
    mockHandleSubmit = jest.fn().mockReturnValue(Promise.resolve(true));
    mockGetDataModel = jest.fn().mockReturnValue(mockMoveCarrierDataModel);

    // -- mock use action module props
    mockUseActionModuleProps = {
      actionModuleProps: {
        formik: { values: mockMoveCarrierDataModel },
        actionModel: mockMoveCarrierActionModel,
        isLoading: false,
      },
      resetForm: mockResetForm,
      getDataModel: mockGetDataModel,
      handleSubmit: mockHandleSubmit,
    };

    // -- mock use action module
    mockUseActionModule.mockReturnValue(mockUseActionModuleProps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders (inactive)', () => {
    // ACT
    const { queryByTestId } = render(
      <InlineDestinationAction bufferCarrierState={mockCarrierState} destinationKey="final_destination" />
    );

    // ASSERT - should render the children by default
    expect(queryByTestId(dataTestIds.currentDisplay)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.currentDisplay)).toHaveTextContent('aux-buffer-2');
    expect(queryByTestId(dataTestIdsDropDown.field('to_location'))).not.toBeInTheDocument();
  });

  it('renders dropdown on active', () => {
    // ACT
    const { queryByTestId } = render(
      <InlineDestinationAction bufferCarrierState={mockCarrierState} destinationKey="final_destination" isActive />
    );

    // ASSERT - should render dropdown
    expect(queryByTestId(dataTestIds.currentDisplay)).not.toBeInTheDocument();
    expect(queryByTestId(dataTestIdsDropDown.field('to_location'))).toBeInTheDocument();
  });

  it('resets form when there has been changes in buffer carrier state', () => {
    // ARRANGE
    // -- init render
    const { rerender } = render(
      <InlineDestinationAction bufferCarrierState={mockCarrierState} destinationKey="final_destination" isActive />
    );
    // -- new state
    const mockNewCarrierState = {
      ...mockCarrierState,
      next_destination:
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/AuxBuffer2',
      final_destination:
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/AuxBuffer2',
    };

    // ACT
    rerender(
      <InlineDestinationAction bufferCarrierState={mockNewCarrierState} destinationKey="final_destination" isActive />
    );

    // ASSERT
    expect(mockResetForm).toHaveBeenCalled();
  });

  it('submits on change and shows temporary saved value', async () => {
    // ARRANGE
    // -- initial render
    const { queryByTestId, rerender } = render(
      <InlineDestinationAction bufferCarrierState={mockCarrierState} destinationKey="final_destination" isActive />
    );
    // -- emulate waiting when submit
    mockUseActionModuleProps = {
      ...mockUseActionModuleProps,
      handleSubmit: jest.fn().mockReturnValue(new Promise(resolve => setTimeout(resolve, 100))),
    };

    // ACT 1
    // -- new formik values
    const mockNewValues = {
      ...mockMoveCarrierDataModel,
      to_location: { value: 'seedling-buffer' },
    };
    // -- apply new values to hook
    mockUseActionModule.mockReturnValue({
      ...mockUseActionModuleProps,
      actionModuleProps: {
        ...mockUseActionModuleProps.actionModuleProps,
        formik: { values: mockNewValues, dirty: true },
      },
    });
    // -- reset lifecycle
    await act(async () =>
      rerender(<InlineDestinationAction bufferCarrierState={mockCarrierState} destinationKey="final_destination" />)
    );

    // ASSERT 1
    // -- check for saving in progress node
    await waitFor(() => {
      expect(queryByTestId(dataTestIds.saving)).toBeInTheDocument();
    });

    // ARRANGE 2 -- there can be a possibility when the form gets in a state with no value
    mockUseActionModule.mockReturnValue({
      ...mockUseActionModuleProps,
      actionModuleProps: {
        ...mockUseActionModuleProps.actionModuleProps,
        formik: { values: {}, dirty: false },
      },
    });

    // ACT 2
    // -- reset lifecycle
    await act(async () =>
      rerender(<InlineDestinationAction bufferCarrierState={mockCarrierState} destinationKey="final_destination" />)
    );

    // ASSERT 2
    // -- make sure saving in progress node is not there
    await waitFor(() => {
      expect(queryByTestId(dataTestIds.saving)).not.toBeInTheDocument();
    });
  });

  it('submits on change and calls all callback', async () => {
    // ARRANGE 1
    // -- mock after submit callback
    const mockOnAfterSubmitAsync = jest.fn().mockReturnValue(Promise.resolve(true));

    // -- initial render
    const { queryByTestId, rerender } = render(
      <InlineDestinationAction
        bufferCarrierState={mockCarrierState}
        destinationKey="final_destination"
        isActive
        onAfterSubmitAsync={mockOnAfterSubmitAsync}
      />
    );

    // ACT 1
    // -- new formik values
    const mockNewValues = {
      ...mockMoveCarrierDataModel,
      to_location: { value: 'seedling-buffer' },
    };
    // -- apply new values to hook
    mockUseActionModule.mockReturnValue({
      ...mockUseActionModuleProps,
      actionModuleProps: {
        ...mockUseActionModuleProps.actionModuleProps,
        formik: { values: mockNewValues, dirty: true },
      },
    });
    // -- reset lifecycle
    await act(async () =>
      rerender(
        <InlineDestinationAction
          bufferCarrierState={mockCarrierState}
          onAfterSubmitAsync={mockOnAfterSubmitAsync}
          destinationKey="final_destination"
        />
      )
    );

    // ASSERT 1
    // -- check for callbacks and resetting to fire
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
      expect(mockOnAfterSubmitAsync).toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalledTimes(1);
      expect(queryByTestId(dataTestIds.saving)).toBeInTheDocument();
    });

    // ARRANGE 2
    // -- mock change to carrier state (updating with new value)
    const mockNewCarrierState = {
      ...mockCarrierState,
      next_destination:
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/SeedlingBuffer',
      final_destination:
        'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/IntelliTrak/containerLocations/SeedlingBuffer',
    };

    // ACT 2
    // -- update state with new value
    await act(async () =>
      rerender(
        <InlineDestinationAction
          bufferCarrierState={mockNewCarrierState}
          onAfterSubmitAsync={mockOnAfterSubmitAsync}
          destinationKey="final_destination"
        />
      )
    );

    // ASSERT
    // -- check for callbacks and resetting to fire
    await waitFor(() => {
      expect(queryByTestId(dataTestIds.saving)).not.toBeInTheDocument();
      expect(mockResetForm).toHaveBeenCalledTimes(2);
    });
  });

  it('resets everything if submit failed', async () => {
    // ARRANGE
    // -- mock after submit callback
    const mockOnAfterSubmitAsync = jest.fn().mockReturnValue(Promise.resolve(true));

    // -- fail the call
    mockHandleSubmit = jest.fn().mockReturnValue(Promise.reject(true));
    mockUseActionModuleProps = {
      ...mockUseActionModuleProps,
      handleSubmit: mockHandleSubmit,
    };
    mockUseActionModule.mockReturnValue(mockUseActionModuleProps);

    // -- initial render
    const { queryByTestId, rerender } = render(
      <InlineDestinationAction
        bufferCarrierState={mockCarrierState}
        isActive
        destinationKey="final_destination"
        onAfterSubmitAsync={mockOnAfterSubmitAsync}
      />
    );

    // ACT
    // -- new formik values
    const mockNewValues = {
      ...mockMoveCarrierDataModel,
      to_location: { value: 'seedling-buffer' },
    };
    // -- apply new values to hook
    mockUseActionModule.mockReturnValue({
      ...mockUseActionModuleProps,
      actionModuleProps: {
        ...mockUseActionModuleProps.actionModuleProps,
        formik: { values: mockNewValues, dirty: true },
      },
    });
    // -- reset lifecycle
    await act(async () =>
      rerender(
        <InlineDestinationAction
          bufferCarrierState={mockCarrierState}
          isActive
          destinationKey="final_destination"
          onAfterSubmitAsync={mockOnAfterSubmitAsync}
        />
      )
    );

    // ASSERT
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled();
      expect(mockOnAfterSubmitAsync).not.toHaveBeenCalled();
      expect(mockResetForm).toHaveBeenCalledTimes(2);
      expect(queryByTestId(dataTestIds.saving)).not.toBeInTheDocument();
    });
  });
});
