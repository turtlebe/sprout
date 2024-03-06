import { dataTestIdsDropDown } from '@plentyag/app-production/src/actions-modules';
import { getDataModelFromReactorState } from '@plentyag/app-production/src/actions-modules/serializers/pause-buffer-tables/get-data-model-from-reactor-state';
import {
  mockPauseBufferOutflowActionModel,
  mockReactorState,
} from '@plentyag/app-production/src/actions-modules/test-helpers';
import { blurTextField, changeTextField, openSelect } from '@plentyag/brand-ui/src/test-helpers';
import { mockCoreState } from '@plentyag/core/src/core-store/test-helpers';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { PAUSE_BUFFER_OUTFLOW_MODE_FIELD, PAUSE_BUFFER_PLAY_COUNT_GOAL } from '../../types';

import { dataTestIdsPauseBufferDropDown as dataTestIds, PauseBufferDropDown } from '.';

import { dataTestIdsMenuChoice } from './menu-choice';

describe('PauseBufferDropDown', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderPauseBufferDropdown = (bufferPath: string) => {
    const mockBufferState = {
      state: mockReactorState.state?.buffersStates?.bufferPathToBufferStateMap[bufferPath],
    };
    const carrierCount = mockBufferState.state.carrierIds.length;

    const values = getDataModelFromReactorState(mockPauseBufferOutflowActionModel, mockBufferState, mockCoreState);
    const mockFormik = {
      initialValues: values,
      values,
      setFieldValue: jest.fn(),
    } as any;
    const mockActionModuleProps = {
      formik: mockFormik,
      actionModel: mockPauseBufferOutflowActionModel,
    };
    return {
      ...render(<PauseBufferDropDown currentCarrierCount={carrierCount} {...mockActionModuleProps} />),
      formik: mockFormik,
    };
  };

  it('renders', () => {
    // ACT
    const { queryByTestId } = renderPauseBufferDropdown(
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer'
    );

    // ASSERT
    expect(queryByTestId(dataTestIds.root)).toBeInTheDocument();
  });

  it('correctly sets the goal count when input is filled out and blurred', async () => {
    // ARRANGE
    const { formik } = renderPauseBufferDropdown(
      'sites/LAX1/areas/TowerAutomation/lines/TransferConveyance/machines/CutagainBuffer'
    );

    // ACT
    // -> Choose a window duration
    await actAndAwait(() => openSelect(dataTestIdsDropDown.field(PAUSE_BUFFER_OUTFLOW_MODE_FIELD)));

    // -> Change play count text input
    await actAndAwait(() => changeTextField(dataTestIdsMenuChoice.goalCountInput, '10'));

    // -> Click off from input
    await actAndAwait(() => blurTextField(dataTestIdsMenuChoice.goalCountInput));

    // ASSERT
    expect(formik.setFieldValue).toHaveBeenCalledWith(PAUSE_BUFFER_PLAY_COUNT_GOAL, '10');
    expect(formik.setFieldValue).toHaveBeenCalledWith(PAUSE_BUFFER_OUTFLOW_MODE_FIELD, {
      value: 'PLAY_WITH_GOAL_COUNT',
    });
  });
});
