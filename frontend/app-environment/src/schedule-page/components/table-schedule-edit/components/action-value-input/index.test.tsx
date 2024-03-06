import {
  clearUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockScheduleDefinitions } from '@plentyag/app-environment/src/common/test-helpers';
import { getActionDefinitions, getActionInitialValue } from '@plentyag/app-environment/src/common/utils';
import { mockUseFetchMeasurementTypes } from '@plentyag/core/src/hooks/use-fetch-measurement-types/test-helpers';
import { render } from '@testing-library/react';
import React from 'react';

import { ActionValueInput, dataTestIdsActionValueInput as dataTestIds } from '.';

const mockOnChangeActionValue = jest.fn();
const mockOnBlurActionValue = jest.fn();
const mockDataTestId = 'mockDataTestId';

function renderActionValueInput(actionDefinition, actionValue) {
  return render(
    <ActionValueInput
      actionDefinition={actionDefinition}
      actionValue={actionValue}
      onChangeActionValue={mockOnChangeActionValue}
      onBlurActionValue={mockOnBlurActionValue}
      data-testid={mockDataTestId}
    />
  );
}

describe('ActionValueInput', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    mockUseFetchMeasurementTypes();
    clearUnitPreferenceLocalStorage();
  });

  it('renders dropdown for action definition', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'SetLightIntensity');
    const [{ actionDefinition }] = getActionDefinitions(scheduleDefinition);
    const actionValue = getActionInitialValue(actionDefinition);

    const { queryByTestId } = renderActionValueInput(actionDefinition, actionValue);

    expect(queryByTestId(dataTestIds.selectDropdownValueInput(mockDataTestId))).toBeInTheDocument();
  });

  it('renders text field for action definition', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'ThermalHumidity');
    const [{ actionDefinition }] = getActionDefinitions(scheduleDefinition);
    const actionValue = getActionInitialValue(actionDefinition);

    const { queryByTestId } = renderActionValueInput(actionDefinition, actionValue);

    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId))).toBeInTheDocument();
  });

  it('validates text field values for action definition are in the default schedule unit range', () => {
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'ThermalTemperature');
    const [{ actionDefinition }] = getActionDefinitions(scheduleDefinition);
    const actionValue = getActionInitialValue(actionDefinition);

    const { queryByTestId } = renderActionValueInput(actionDefinition, actionValue);

    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId)).querySelector('input')).toHaveAttribute(
      'max',
      '100'
    );
    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId)).querySelector('input')).toHaveAttribute(
      'min',
      '0'
    );
  });

  it('validates text field values for action definition are in a user specified unit range, variation Temperature C', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'C' });
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'ThermalTemperature');
    const [{ actionDefinition }] = getActionDefinitions(scheduleDefinition);
    const actionValue = getActionInitialValue(actionDefinition);

    const { queryByTestId } = renderActionValueInput(actionDefinition, actionValue);

    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId)).querySelector('input')).toHaveAttribute(
      'max',
      '100'
    );
    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId)).querySelector('input')).toHaveAttribute(
      'min',
      '0'
    );
  });

  it('validates text field values for action definition are in user a specified unit range, variation Temperature F', () => {
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });
    const scheduleDefinition = mockScheduleDefinitions.find(sd => sd.name === 'ThermalTemperature');
    const [{ actionDefinition }] = getActionDefinitions(scheduleDefinition);
    const actionValue = getActionInitialValue(actionDefinition);

    const { queryByTestId } = renderActionValueInput(actionDefinition, actionValue);

    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId)).querySelector('input')).toHaveAttribute(
      'max',
      '212'
    );
    expect(queryByTestId(dataTestIds.textFieldValueInput(mockDataTestId)).querySelector('input')).toHaveAttribute(
      'min',
      '32'
    );
  });
});
