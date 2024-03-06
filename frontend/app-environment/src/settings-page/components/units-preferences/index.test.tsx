import {
  clearUnitPreferenceLocalStorage,
  getUnitPreferenceLocalStorage,
  setUnitPreferenceLocalStorage,
} from '@plentyag/app-environment/src/common/hooks/use-local-storage-units-preferences/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { useSwrAxios } from '@plentyag/core/src/hooks';
import { render } from '@testing-library/react';
import React from 'react';

import { dataTestIdsUnitsPreferences as dataTestIds, UnitsPreferences } from '.';

jest.mock('@plentyag/core/src/hooks');

const mockUseSwrAxios = useSwrAxios as jest.Mock;

const temperature = mockMeasurementTypes.find(measurementType => measurementType.key === 'TEMPERATURE');
const celsius = temperature.supportedUnits['C'];
const fahrenheit = temperature.supportedUnits['F'];

const activeClass = 'MuiButton-outlinedPrimary';

describe('UnitsPreferences', () => {
  beforeEach(() => {
    mockUseSwrAxios.mockRestore();
    clearUnitPreferenceLocalStorage();
  });

  it('shows a list of MeasurementTypes', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes, isValidating: false });

    const { queryByTestId } = render(<UnitsPreferences />);

    expect(queryByTestId(dataTestIds.rowMeasurementType(temperature))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonUnit(celsius))).not.toHaveClass(activeClass);
    expect(queryByTestId(dataTestIds.buttonUnit(fahrenheit))).not.toHaveClass(activeClass);
    expect(getUnitPreferenceLocalStorage()).toEqual({});

    queryByTestId(dataTestIds.buttonUnit(fahrenheit)).click();

    expect(queryByTestId(dataTestIds.buttonUnit(fahrenheit))).toHaveClass(activeClass);
    expect(getUnitPreferenceLocalStorage()).toEqual({ TEMPERATURE: 'F' });
  });

  it('shows a list with active MeasurementTypes', () => {
    mockUseSwrAxios.mockReturnValue({ data: mockMeasurementTypes, isValidating: false });
    setUnitPreferenceLocalStorage({ TEMPERATURE: 'F' });

    const { queryByTestId } = render(<UnitsPreferences />);

    expect(queryByTestId(dataTestIds.rowMeasurementType(temperature))).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.buttonUnit(celsius))).not.toHaveClass(activeClass);
    expect(queryByTestId(dataTestIds.buttonUnit(fahrenheit))).toHaveClass(activeClass);
  });
});
