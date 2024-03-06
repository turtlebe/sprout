import { getDataModelFromReactorState } from '@plentyag/app-production/src/actions-modules/serializers/pause-buffer-tables/get-data-model-from-reactor-state';
import {
  mockPauseBufferOutflowActionModel,
  mockReactorState,
} from '@plentyag/app-production/src/actions-modules/test-helpers';
import { mockCoreState } from '@plentyag/core/src/core-store/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { PAUSE_BUFFER_OUTFLOW_MODE_FIELD, PauseBufferOutflowModeChoices } from '../../types';

import { dataTestIdsPauseBufferButton as dataTestIds, PauseBufferButton } from '.';

const mockBufferName = 'PickupBuffer';

describe('PauseBufferButton', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderPauseBufferButton(bufferPath: string, isLoading = false) {
    const mockBufferState = {
      state: mockReactorState.state?.buffersStates?.bufferPathToBufferStateMap[bufferPath],
    };
    const values = getDataModelFromReactorState(mockPauseBufferOutflowActionModel, mockBufferState, mockCoreState);
    const mockFormik = {
      values,
      setFieldValue: jest.fn(),
    } as any;
    const mockActionModuleProps = {
      formik: mockFormik,
      actionModel: mockPauseBufferOutflowActionModel,
      isLoading,
    };
    const result = render(
      <PauseBufferButton actionModuleProps={mockActionModuleProps} bufferName={mockBufferName} isLoading={isLoading} />
    );

    return { ...result, mockFormik };
  }

  it('renders the button in paused state', () => {
    const { queryByTestId } = renderPauseBufferButton(
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer'
    );

    expect(queryByTestId(dataTestIds.pause)).toHaveAttribute('data-state', 'true');
    expect(queryByTestId(dataTestIds.play)).toHaveAttribute('data-state', 'false');
    expect(queryByTestId(dataTestIds.pause)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.play)).not.toBeDisabled();
  });

  it('renders the button in play', () => {
    const { queryByTestId } = renderPauseBufferButton(
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer2'
    );

    expect(queryByTestId(dataTestIds.pause)).toHaveAttribute('data-state', 'false');
    expect(queryByTestId(dataTestIds.play)).toHaveAttribute('data-state', 'true');
    expect(queryByTestId(dataTestIds.pause)).not.toBeDisabled();
    expect(queryByTestId(dataTestIds.play)).not.toBeDisabled();
  });

  it('pauses when pause button is clicked', () => {
    const { queryByTestId, mockFormik } = renderPauseBufferButton(
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer2'
    );

    queryByTestId(dataTestIds.pause).click();

    expect(mockFormik.setFieldValue).toHaveBeenCalledWith(PAUSE_BUFFER_OUTFLOW_MODE_FIELD, {
      value: PauseBufferOutflowModeChoices.PAUSE,
    });
  });

  it('plays when the play button is clicked', () => {
    const { queryByTestId, mockFormik } = renderPauseBufferButton(
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1'
    );

    queryByTestId(dataTestIds.play).click();

    expect(mockFormik.setFieldValue).toHaveBeenCalledWith(PAUSE_BUFFER_OUTFLOW_MODE_FIELD, {
      value: PauseBufferOutflowModeChoices.PLAY,
    });
  });

  it('disables buttons when there is invalid reactor state value', () => {
    const mockBufferState = {
      state:
        mockReactorState.state?.buffersStates?.bufferPathToBufferStateMap[
          'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1'
        ],
    };
    const values = getDataModelFromReactorState(mockPauseBufferOutflowActionModel, mockBufferState, mockCoreState);
    const inValidValue = { ...values, pause_buffer_outflow_mode: { value: 'invalid' } };
    const mockFormik = {
      values: inValidValue,
      setFieldValue: jest.fn(),
    } as any;
    const mockActionModuleProps = {
      formik: mockFormik,
      actionModel: mockPauseBufferOutflowActionModel,
      isLoading: false,
    };

    const { queryByTestId } = render(
      <PauseBufferButton actionModuleProps={mockActionModuleProps} bufferName={mockBufferName} isLoading={false} />
    );

    expect(queryByTestId(dataTestIds.pause)).toBeDisabled();
    expect(queryByTestId(dataTestIds.play)).toBeDisabled();
  });

  it('disables buttons when loading', () => {
    const { queryByTestId } = renderPauseBufferButton(
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/AuxBuffer1',
      true
    );

    queryByTestId(dataTestIds.pause);
    expect(queryByTestId(dataTestIds.pause)).toBeDisabled();
    expect(queryByTestId(dataTestIds.play)).toBeDisabled();
  });
});
