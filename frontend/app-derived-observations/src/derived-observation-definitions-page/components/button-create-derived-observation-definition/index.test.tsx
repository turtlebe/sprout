import {
  mockBaseObservationDefinitions,
  mockDerivedObservationDefinitions,
} from '@plentyag/app-derived-observations/src/common/test-helpers';
import { mockUseSwrAxiosImpl as mockAutocompleteFdsObjectUseSwrAxiosImpl } from '@plentyag/brand-ui/src/components/autocomplete-farm-def-object/test-helpers';
import { GlobalSnackbar } from '@plentyag/brand-ui/src/components/global-snackbar';
import {
  changeTextField,
  chooseFromAutocompleteByIndex,
  chooseFromSelect,
  expectErrorOn,
  expectNoErrorOn,
  getInputByName,
  getSubmitButton,
  openAutocomplete,
  openSelect,
} from '@plentyag/brand-ui/src/test-helpers';
import { mockCurrentUser } from '@plentyag/core/src/core-store/test-helpers';
import { mockMeasurementTypes } from '@plentyag/core/src/farm-def/test-helpers';
import { useGetRequest, usePostRequest, usePutRequest, useSwrAxios } from '@plentyag/core/src/hooks';
import { actAndAwait } from '@plentyag/core/src/test-helpers';
import { Output, WindowDuration } from '@plentyag/core/src/types/derived-observations';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const mockObservationDefinitions = [...mockBaseObservationDefinitions, ...mockDerivedObservationDefinitions];

import {
  ButtonCreateDerivedObservationDefinition,
  dataTestIdsButtonCreateDerivedObservationDefinition as dataTestIds,
} from '.';

jest.mock('@plentyag/core/src/hooks/use-axios');
jest.mock('@plentyag/core/src/hooks/use-swr-axios');

const mockUsePostRequest = usePostRequest as jest.Mock;
const mockUsePutRequest = usePutRequest as jest.Mock;
const mockUseGetRequest = useGetRequest as jest.Mock;
const mockUseSwrAxios = useSwrAxios as jest.Mock;
const onSuccess = jest.fn();

const values = {
  streamName: 'AirTemperatureMean5Minutes',
  sourceStreamNames: ['SSF2Nutrien3SupplyTankVolumeAvg5Min', 'LAR1NorthBuildingGP16SupplyOutletPressureAvg5Min'],
  expression: 'expression',
  window: WindowDuration.fiveMinutes,
  output: Output.double,
  path: 'sites/LAR1',
  observationName: 'AirTemperatureMean5Minutes',
  measurementType: 'APPARENT_POWER',
  unit: 'KVA',
};

describe('ButtonCreateDerivedObservationDefinition', () => {
  beforeEach(() => {
    mockUsePostRequest.mockRestore();
    mockUsePutRequest.mockRestore();
    mockUseGetRequest.mockRestore();
    mockUseSwrAxios.mockRestore();
    onSuccess.mockRestore();
  });

  it('renders nothing when current user has insufficient permission', () => {
    mockCurrentUser();
    mockUseSwrAxios.mockReturnValue({ data: undefined, isValidating: false });

    const { container } = render(<ButtonCreateDerivedObservationDefinition onSuccess={onSuccess} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('opens a dialog to create a DerivedObservationDefinition', async () => {
    mockCurrentUser({ permissions: { HYP_DERIVED_OBSERVATIONS: 'EDIT' } });
    const makeRequest = jest.fn().mockImplementation(({ onSuccess }) => onSuccess({ id: 'id' }));
    mockUsePostRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest });
    mockUsePutRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseGetRequest.mockReturnValue({ data: undefined, isLoading: false, makeRequest: jest.fn() });
    mockUseSwrAxios.mockImplementation(args => {
      if (!args || !args.url) {
        return { data: undefined, error: undefined, isValidating: false };
      }

      if (args.url.includes('observation-definitions')) {
        return { data: mockObservationDefinitions, isValidating: false };
      }

      if (args.url.includes('search-measurement-types')) {
        return { data: mockMeasurementTypes, isValidating: false };
      }

      return mockAutocompleteFdsObjectUseSwrAxiosImpl(args);
    });

    const { queryByTestId } = render(
      <MemoryRouter>
        <GlobalSnackbar>
          <ButtonCreateDerivedObservationDefinition onSuccess={onSuccess} />
        </GlobalSnackbar>
      </MemoryRouter>
    );

    // -> Dialog is not visible
    expect(queryByTestId(dataTestIds.button)).toBeInTheDocument();
    expect(queryByTestId(dataTestIds.dialog)).not.toBeInTheDocument();

    queryByTestId(dataTestIds.button).click();

    expect(queryByTestId(dataTestIds.dialog)).toBeInTheDocument();

    // -> Form is empty
    expect(getInputByName('streamName')).toHaveValue('');
    expect(getInputByName('window')).toHaveValue('');
    expect(getInputByName('sourceStreamNames')).toHaveValue('');
    expect(getInputByName('expression')).toHaveValue('');
    expect(getInputByName('output')).toHaveValue('');
    expect(getInputByName('path')).toHaveValue('');
    expect(getInputByName('observationName')).toHaveValue('');
    expect(getInputByName('outputMeasurementType')).toHaveValue('');
    expect(getInputByName('outputMeasurementTypeUnits')).toHaveValue('');

    // -> Try to validate and trigger validations
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expectErrorOn('streamName');
    expectErrorOn('window');
    expectErrorOn('sourceStreamNames');
    expectErrorOn('expression');
    expectErrorOn('output');
    expectErrorOn('path');
    expectErrorOn('observationName');
    expectErrorOn('outputMeasurementType');
    expectNoErrorOn('outputMeasurementTypeUnits');

    // -> Choose a streamName
    await actAndAwait(() => changeTextField('streamName', values.streamName));

    // -> Choose a window duration
    await actAndAwait(() => openSelect('window'));
    await actAndAwait(() => chooseFromSelect(values.window));

    // -> Choose sources
    await actAndAwait(() => openAutocomplete('sourceStreamNames'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => openAutocomplete('sourceStreamNames'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(1));
    await actAndAwait(() =>
      document.querySelector<HTMLButtonElement>('[data-testid="sourceStreamNames"] [aria-label="Close"]').click()
    );

    // -> Choose an expression
    await actAndAwait(() => changeTextField('expression', values.expression));

    // -> Choose an ouput
    await actAndAwait(() => openSelect('output'));
    await actAndAwait(() => chooseFromSelect(values.output));

    // -> Choose a path
    await actAndAwait(() => openAutocomplete('path'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));
    await actAndAwait(() => fireEvent.blur(getInputByName('path'))); // Trigger validation

    // -> Choose an observationName
    await actAndAwait(() => changeTextField('observationName', values.observationName));

    // -> Choose a measuremenType
    await actAndAwait(() => openAutocomplete('outputMeasurementType'));
    await actAndAwait(() => chooseFromAutocompleteByIndex(0));

    expectNoErrorOn('streamName');
    expectNoErrorOn('window');
    expectNoErrorOn('sourceStreamNames');
    expectNoErrorOn('expression');
    expectNoErrorOn('output');
    expectNoErrorOn('path');
    expectNoErrorOn('observationName');
    expectNoErrorOn('outputMeasurementType');
    expectNoErrorOn('outputMeasurementTypeUnits');

    // -> Re-submit
    await actAndAwait(() => queryByTestId(getSubmitButton()).click());

    expect(makeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          createdBy: 'olittle',
          streamName: values.streamName,
          sourceStreamNames: values.sourceStreamNames,
          expression: values.expression,
          observationKey: {
            path: values.path,
            observationName: values.observationName,
          },
          window: values.window,
          output: values.output,
          outputMeasurementType: values.measurementType,
          outputMeasurementTypeUnits: values.unit,
        },
        url: '/api/swagger/environment-service/derived-observation-definitions-api/create-derived-observation-definition',
      })
    );
    expect(onSuccess).toHaveBeenCalled();
  });
});
